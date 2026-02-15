import type { City, TSPStep } from './types';
import { euclideanDistance } from '../utils/distance';

export function* greedyTSP(cities: City[]): Generator<TSPStep> {
  const n = cities.length;
  const visited = new Set();
  visited.add(0);
  const path = [0];
  let totalDistance = 0;
  let currentCity = 0;

  while (visited.size < n) {
    let nearestCity = -1;
    let minDistance = Infinity;
    for (let i = 0; i < n; i++) {
      if (visited.has(i)) continue;
      const distance = euclideanDistance(cities[currentCity], cities[i]);
      yield { type: 'CONSIDER', currentCity, nextCity: i, path: [...path], distance: totalDistance + distance };
      if (distance < minDistance) { minDistance = distance; nearestCity = i; }
    }
    visited.add(nearestCity);
    path.push(nearestCity);
    totalDistance += minDistance;
    currentCity = nearestCity;
    yield { type: 'VISIT', currentCity: nearestCity, path: [...path], distance: totalDistance };
  }

  const returnDist = euclideanDistance(cities[currentCity], cities[0]);
  totalDistance += returnDist;
  path.push(0);
  yield { type: 'COMPLETE', currentCity: 0, path: [...path], distance: totalDistance };
}
