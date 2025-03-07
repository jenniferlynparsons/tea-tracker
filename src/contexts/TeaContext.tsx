import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Tea } from '../types/Tea';
import { getInitialTeas } from '../data/sampleTeas';
import { getTeasFromStorage, saveTeasToStorage, clearTeaStorage } from '../utils/storage';
import { teaDB } from '../services/db';
import { exportToJson, exportToCsv, downloadFile, isValidTea } from '../utils/exportImport';

interface TeaContextType {
  teas: Tea[];
  addTea: (tea: Tea) => void;
  updateTea: (tea: Tea) => void;
  deleteTea: (id: string) => void;
  getTea: (id: string) => Tea | undefined;
  isLoading: boolean;
  backupStatus: {
    lastBackup: string | null;
    status: 'success' | 'error' | null;
  };
  exportCollection: (format: 'json' | 'csv', selectedIds?: string[]) => void;
  importCollection: (file: File) => Promise<void>;
}

const TeaContext = createContext<TeaContextType | undefined>(undefined);

export const TeaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teas, setTeas] = useState<Tea[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [backupStatus, setBackupStatus] = useState<{
    lastBackup: string | null;
    status: 'success' | 'error' | null;
  }>({ lastBackup: null, status: null });

  // Initialize database and load teas
  useEffect(() => {
    const initDB = async () => {
      try {
        await teaDB.init();
        const storedTeas = await teaDB.getAllTeas();
        
        if (storedTeas.length > 0) {
          setTeas(storedTeas);
        } else {
          // Migrate from localStorage if exists
          const legacyTeas = getTeasFromStorage();
          if (legacyTeas.length > 0) {
            await teaDB.saveTeas(legacyTeas);
            setTeas(legacyTeas);
            clearTeaStorage(); // Clear localStorage after migration
          } else {
            const initialTeas = getInitialTeas();
            await teaDB.saveTeas(initialTeas);
            setTeas(initialTeas);
          }
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  // Create periodic backups
  useEffect(() => {
    if (!isInitialized) return;

    const createBackup = async () => {
      try {
        await teaDB.createBackup();
        setBackupStatus({
          lastBackup: new Date().toISOString(),
          status: 'success'
        });
      } catch (error) {
        console.error('Backup failed:', error);
        setBackupStatus(prev => ({
          ...prev,
          status: 'error'
        }));
      }
    };

    // Create backup every hour
    const backupInterval = setInterval(createBackup, 3600000);
    createBackup(); // Initial backup

    return () => clearInterval(backupInterval);
  }, [isInitialized]);

  // Update database when teas change
  useEffect(() => {
    if (isInitialized) {
      teaDB.saveTeas(teas);
    }
  }, [teas, isInitialized]);

  const addTea = useCallback((tea: Tea) => {
    setTeas(currentTeas => {
      const newTeas = [...currentTeas, tea];
      return newTeas;
    });
  }, []);

  const updateTea = useCallback((updatedTea: Tea) => {
    setTeas(currentTeas => {
      const newTeas = currentTeas.map(tea => 
        tea.id === updatedTea.id ? updatedTea : tea
      );
      return newTeas;
    });
  }, []);

  const deleteTea = useCallback((id: string) => {
    setTeas(currentTeas => {
      const newTeas = currentTeas.filter(tea => tea.id !== id);
      return newTeas;
    });
  }, []);

  const getTea = (id: string) => {
    return teas.find(tea => tea.id === id);
  };

  const exportCollection = useCallback((format: 'json' | 'csv' = 'json', selectedIds?: string[]) => {
    const content = format === 'json' 
      ? exportToJson(teas, selectedIds)
      : exportToCsv(teas, selectedIds);
    
    const filename = `tea-collection-${new Date().toISOString()}.${format}`;
    const type = format === 'json' ? 'application/json' : 'text/csv';
    
    downloadFile(content, filename, type);
  }, [teas]);

  const importCollection = useCallback(async (file: File): Promise<void> => {
    try {
      const content = await file.text();
      const importedTeas = JSON.parse(content);
      
      // Validate imported data
      if (!Array.isArray(importedTeas) || !importedTeas.every(isValidTea)) {
        throw new Error('Invalid tea data format');
      }

      // Merge with existing data (avoid duplicates by ID)
      const mergedTeas = [...teas];
      importedTeas.forEach(importedTea => {
        const existingIndex = mergedTeas.findIndex(t => t.id === importedTea.id);
        if (existingIndex >= 0) {
          mergedTeas[existingIndex] = importedTea;
        } else {
          mergedTeas.push(importedTea);
        }
      });

      setTeas(mergedTeas);
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }, [teas]);

  const value = {
    teas,
    addTea,
    updateTea,
    deleteTea,
    getTea,
    isLoading,
    backupStatus,
    exportCollection,
    importCollection,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <TeaContext.Provider value={value}>{children}</TeaContext.Provider>;
};

export const useTea = () => {
  const context = useContext(TeaContext);
  if (context === undefined) {
    throw new Error('useTea must be used within a TeaProvider');
  }
  return context;
};
