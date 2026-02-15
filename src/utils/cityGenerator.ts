import type { City } from '../algorithms/types';

export function generateRandomCities(count: number, width = 750, height = 550, padding = 60): City[] {
  const cities: City[] = [];
  for (let i = 0; i < count; i++) {
    cities.push({
      id: i,
      x: padding + Math.random() * (width - 2 * padding),
      y: padding + Math.random() * (height - 2 * padding),
      name: i < 26 ? String.fromCharCode(65 + i) : 'C' + i,
    });
  }
  return cities;
}
