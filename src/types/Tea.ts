export interface Tea {
  id: string;
  name: string;
  brand: string;
  type: TeaType;
  form: TeaForm;
  
  // Quantity tracking
  amount: number;
  unit: Unit; 
  
  // Rating
  rating: number; // 0-5 in 0.5 increments
  
  // Tasting notes
  tastingNotes: string;
  
  // Brewing instructions
  brewingInstructions: {
    temperature: number;
    tempUnit: TemperatureUnit;
    steepTimeInSeconds: number;
  };
  
  // Additional metadata
  origin?: string;
  purchaseDate?: string; // ISO date string
  imageUrl?: string;
  price?: number;
  currency?: string;
  notes?: string;
  ingredients?: string[];
  organic?: boolean;
  caffeineLevel?: CaffeineLevel;
  flavorTags?: FlavorProfile[];
  brewingHistory?: BrewingHistory[];
  totalBrewCount?: number;
  lastBrewed?: string;  // ISO date string
  lowStockThreshold?: number;  // Minimum amount before alert
}

export interface BrewingHistory {
  date: string;  // ISO date string
  amount: number;
  unit: Unit;
}

export enum TeaType {
  Black = "Black",
  Green = "Green",
  White = "White",
  Oolong = "Oolong",
  Herbal = "Herbal",
  Rooibos = "Rooibos",
  Pu_erh = "Pu-erh",
  Yellow = "Yellow",
  Blend = "Blend",
  Other = "Other",
}

export enum TeaForm {
  LooseLeaf = "Loose Leaf",
  Bagged = "Bagged",
}

export enum Unit {
  Grams = "g",
  Ounces = "oz",
  Bags = "bags",
  Pieces = "pieces",
}

export enum TemperatureUnit {
  Celsius = "C",
  Fahrenheit = "F",
}

export enum CaffeineLevel {
  None = "None",
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum FlavorProfile {
  Floral = "Floral",
  Fruity = "Fruity",
  Vegetal = "Vegetal",
  Nutty = "Nutty",
  Spicy = "Spicy",
  Sweet = "Sweet",
  Earthy = "Earthy",
  Mineral = "Mineral",
  Roasted = "Roasted",
  Citrus = "Citrus"
}
