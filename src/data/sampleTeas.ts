import { Tea, TeaType, TeaForm, Unit, TemperatureUnit, CaffeineLevel } from '../types/Tea';
import { v4 as uuidv4 } from 'uuid';

export const getInitialTeas = (): Tea[] => [
  {
    id: uuidv4(),
    name: "Earl Grey Supreme",
    brand: "Harney & Sons",
    type: TeaType.Black,
    form: TeaForm.LooseLeaf,
    amount: 100,
    unit: Unit.Grams,
    rating: 4.5,
    tastingNotes: "Citrusy bergamot with light floral notes. Smooth with minimal astringency.",
    brewingInstructions: {
      temperature: 95,
      tempUnit: TemperatureUnit.Celsius,
      steepTimeInSeconds: 240,
    },
    origin: "China/India/Sri Lanka Blend",
    purchaseDate: "2023-06-15",
    imageUrl: "",
    price: 15.99,
    currency: "USD",
    notes: "A favorite morning tea. Good with milk.",
    ingredients: ["Black tea", "Bergamot oil"],
    organic: false,
    caffeineLevel: CaffeineLevel.Medium,
  },
  {
    id: uuidv4(),
    name: "Jasmine Dragon Pearls",
    brand: "Teavana",
    type: TeaType.Green,
    form: TeaForm.LooseLeaf,
    amount: 50,
    unit: Unit.Grams,
    rating: 5,
    tastingNotes: "Strong jasmine aroma, sweet and floral taste with a smooth finish.",
    brewingInstructions: {
      temperature: 80,
      tempUnit: TemperatureUnit.Celsius,
      steepTimeInSeconds: 180,
    },
    origin: "Fujian, China",
    purchaseDate: "2023-05-20",
    imageUrl: "",
    price: 24.99,
    currency: "USD",
    notes: "Can be steeped multiple times. Gets better with each steep.",
    ingredients: ["Green tea", "Jasmine flowers"],
    organic: true,
    caffeineLevel: CaffeineLevel.Low,
  },
  {
    id: uuidv4(),
    name: "Sleepytime",
    brand: "Celestial Seasonings",
    type: TeaType.Herbal,
    form: TeaForm.Bagged,
    amount: 20,
    unit: Unit.Bags,
    rating: 3.5,
    tastingNotes: "Mild mint with chamomile. Slightly sweet and very soothing.",
    brewingInstructions: {
      temperature: 100,
      tempUnit: TemperatureUnit.Celsius,
      steepTimeInSeconds: 300,
    },
    origin: "United States",
    purchaseDate: "2023-07-01",
    imageUrl: "",
    price: 4.99,
    currency: "USD",
    notes: "Good before bed. No caffeine.",
    ingredients: ["Chamomile", "Spearmint", "Lemongrass", "Tilia Flowers", "Blackberry Leaves", "Orange Blossoms", "Hawthorn", "Rosebuds"],
    organic: false,
    caffeineLevel: CaffeineLevel.None,
  }
];
