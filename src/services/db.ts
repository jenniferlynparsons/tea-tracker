import { Tea } from '../types/Tea';

const DB_NAME = 'teaTrackerDB';
const DB_VERSION = 1;

interface TeaDB {
  teas: Tea[];
  backups: Array<{
    date: string;
    data: Tea[];
  }>;
}

export class TeaDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('teas')) {
          const teaStore = db.createObjectStore('teas', { keyPath: 'id' });
          teaStore.createIndex('type', 'type');
          teaStore.createIndex('rating', 'rating');
          teaStore.createIndex('lastBrewed', 'lastBrewed');
        }

        if (!db.objectStoreNames.contains('backups')) {
          db.createObjectStore('backups', { keyPath: 'date' });
        }
      };
    });
  }

  async getAllTeas(): Promise<Tea[]> {
    return this.performTransaction('teas', 'readonly', async (store) => {
      const request = store.getAll();
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  async saveTeas(teas: Tea[]): Promise<void> {
    await this.performTransaction('teas', 'readwrite', async (store) => {
      await new Promise<void>((resolve, reject) => {
        const clearRequest = store.clear();
        clearRequest.onerror = () => reject(clearRequest.error);
        clearRequest.onsuccess = () => resolve();
      });

      await Promise.all(teas.map(tea => 
        new Promise<void>((resolve, reject) => {
          const request = store.put(tea);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        })
      ));
    });
  }

  async createBackup(): Promise<void> {
    const teas = await this.getAllTeas();
    const backup = {
      date: new Date().toISOString(),
      data: teas
    };

    await this.performTransaction('backups', 'readwrite', async (store) => {
      await new Promise<void>((resolve, reject) => {
        const putRequest = store.put(backup);
        putRequest.onerror = () => reject(putRequest.error);
        putRequest.onsuccess = () => resolve();
      });

      await new Promise<void>((resolve) => {
        const request = store.openCursor(null, 'prev');
        let count = 0;
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor && ++count > 5) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
      });
    });
  }

  async getLatestBackup(): Promise<Tea[] | null> {
    const backup = await this.performTransaction('backups', 'readonly', async (store) => {
      return new Promise<Tea[] | null>((resolve) => {
        const request = store.openCursor(null, 'prev');
        request.onsuccess = () => {
          resolve(request.result?.value?.data || null);
        };
      });
    });
    return backup;
  }

  private async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      let result: T;
      
      operation(store)
        .then(value => {
          result = value;
        })
        .catch(reject);

      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const teaDB = new TeaDatabase();
