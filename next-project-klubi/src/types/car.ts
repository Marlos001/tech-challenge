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
}

export interface SearchFilters {
  name?: string;
  model?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  cars?: Car[];
}



