import { Tea } from '../types/Tea';

export const storageKeys = {
  TEAS: 'teaInventory', // Changed key to be more unique
};

export const getTeasFromStorage = (): Tea[] => {
  try {
    const storedTeas = localStorage.getItem(storageKeys.TEAS);
    if (!storedTeas) return [];
    
    const parsedTeas = JSON.parse(storedTeas);
    return Array.isArray(parsedTeas) ? parsedTeas : [];
  } catch (error) {
    console.error('Error loading teas from storage:', error);
    return [];
  }
};

export const saveTeasToStorage = (teas: Tea[]): void => {
  try {
    localStorage.setItem(storageKeys.TEAS, JSON.stringify(teas));
  } catch (error) {
    console.error('Error saving teas to storage:', error);
  }
};

export const clearTeaStorage = (): void => {
  localStorage.removeItem(storageKeys.TEAS);
};
