import { TeaType } from './Tea';

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultBrewingTimes: Record<TeaType, number>;
  dashboardLayout: 'grid' | 'list';
  favoriteTeaIds: string[];
}

export const defaultPreferences: UserPreferences = {
  theme: 'light',
  defaultBrewingTimes: {
    [TeaType.Black]: 240,
    [TeaType.Green]: 180,
    [TeaType.White]: 120,
    [TeaType.Oolong]: 180,
    [TeaType.Herbal]: 300,
    [TeaType.Rooibos]: 300,
    [TeaType.Pu_erh]: 120,
    [TeaType.Yellow]: 120,
    [TeaType.Blend]: 240,
    [TeaType.Other]: 180,
  },
  dashboardLayout: 'grid',
  favoriteTeaIds: [],
};
