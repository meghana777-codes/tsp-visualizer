// Represents a city with coordinates
export interface City {
  id: number;
  x: number;
  y: number;
  name: string;
}

export interface TSPStep {
  type: 'VISIT' | 'CONSIDER' | 'COMPLETE';
  currentCity: number;
  nextCity?: number;
  path: number[];
  distance: number;
}

export interface AlgorithmStats {
  name: string;
  totalDistance: number;
  executionTime: number;
  iterations: number;
}
