import type { City } from '../algorithms/types';

export function euclideanDistance(cityA: City, cityB: City): number {
  const dx = cityA.x - cityB.x;
  const dy = cityA.y - cityB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateTotalDistance(cities: City[], path: number[]): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += euclideanDistance(cities[path[i]], cities[path[i + 1]]);
  }
  return total;
}
