export interface DesignModel {
  id: string;
  name: string;
  type: 'Garden Suite' | 'Laneway House' | 'Basement Suite' | 'Second Story Addition';
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  estimatedCost: number;
  estimatedDuration: string; // e.g., "4-6 months"
  description: string;
  image: string;
  features: string[];
  compatibility: string[]; // e.g., "Zone R1", "Zone R2"
}

export const CATALOGUE_DESIGNS: DesignModel[] = [
  {
    id: 'd1',
    name: 'The Northern Laneway',
    type: 'Laneway House',
    sqft: 850,
    bedrooms: 2,
    bathrooms: 1.5,
    estimatedCost: 285000,
    estimatedDuration: '5-7 months',
    description: 'A modern, compact 2-story laneway home designed for narrow lots. Features a full kitchen, living area, and dedicated workspace.',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop',
    features: ['Solar-ready roof', 'Heated floors', 'Smart home integration', 'Space-saving storage'],
    compatibility: ['Standard City Lot', 'Corner Lot']
  },
  {
    id: 'd2',
    name: 'The Garden Studio',
    type: 'Garden Suite',
    sqft: 450,
    bedrooms: 0, // Studio
    bathrooms: 1,
    estimatedCost: 155000,
    estimatedDuration: '3-4 months',
    description: 'Perfect for a home office, guest suite, or rental unit. This single-level detached suite fits comfortably in most backyards.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1000&auto=format&fit=crop',
    features: ['Large sliding glass doors', 'Vaulted ceilings', 'Energy-efficient insulation'],
    compatibility: ['Small Backyard', 'Standard City Lot']
  },
  {
    id: 'd3',
    name: 'Heritage Extension',
    type: 'Second Story Addition',
    sqft: 1200,
    bedrooms: 3,
    bathrooms: 2,
    estimatedCost: 340000,
    estimatedDuration: '6-8 months',
    description: 'Seamlessly add a second story to your existing bungalow. Designed to respect neighborhood character while doubling your living space.',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1000&auto=format&fit=crop',
    features: ['Master suite with walk-in closet', 'Upper floor laundry', 'Heritage-style cladding'],
    compatibility: ['Existing Bungalow']
  },
  {
    id: 'd4',
    name: 'Urban Basement Suite',
    type: 'Basement Suite',
    sqft: 700,
    bedrooms: 1,
    bathrooms: 1,
    estimatedCost: 95000,
    estimatedDuration: '2-3 months',
    description: 'Transform your underutilized basement into a high-income rental suite or comfortable in-law apartment.',
    image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=1000&auto=format&fit=crop',
    features: ['Soundproofing', 'Separate entrance', 'Fire-rated separation', 'Modern kitchenette'],
    compatibility: ['Full Basement']
  }
];
