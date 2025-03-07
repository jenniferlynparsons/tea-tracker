import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, defaultPreferences } from '../types/Preferences';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  toggleFavorite: (teaId: string) => void;
  isFavorite: (teaId: string) => boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem('userPreferences');
    return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    document.documentElement.setAttribute('data-theme', preferences.theme);
  }, [preferences]);

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  const toggleFavorite = (teaId: string) => {
    setPreferences(prev => {
      const favorites = new Set(prev.favoriteTeaIds);
      favorites.has(teaId) ? favorites.delete(teaId) : favorites.add(teaId);
      return { ...prev, favoriteTeaIds: Array.from(favorites) };
    });
  };

  const isFavorite = (teaId: string) => preferences.favoriteTeaIds.includes(teaId);

  return (
    <PreferencesContext.Provider value={{ 
      preferences, 
      updatePreferences,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
