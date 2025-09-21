export interface Car {
  Name: string;
  Model: string;
  Images: {
    back: string;
    interior: string;
    quarter: string;
    side: string;
  };
  Price: number;
  Location: string;
  Powertrain?: 'electric' | 'hybrid' | 'flex' | 'gasoline' | 'diesel';
  Body?: 'hatch' | 'sedan' | 'suv';
  Seats?: number;
  TrunkLiters?: number;
  Tags?: string[]; // e.g., ['family', 'city', 'economy', 'tech', 'adventure', 'comfort']
}

export interface SearchFilters {
  name?: string;
  model?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  powertrain?: Car['Powertrain'];
  body?: Car['Body'];
  minSeats?: number;
  tags?: string[];
  limit?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  cars?: Car[];
}

export type RecommendationProfileTag = 'family' | 'city' | 'economy' | 'tech' | 'adventure' | 'comfort' | 'performance' | 'travel';




