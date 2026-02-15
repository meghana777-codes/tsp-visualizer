import type { City, TSPStep } from './types';
import { calculateTotalDistance } from '../utils/distance';

export function* twoOptOptimize(cities: City[], initialPath: number[]): Generator<TSPStep> {
  let path = [...initialPath];
  let improved = true;
  let totalDistance = calculateTotalDistance(cities, path);

  while (improved) {
    improved = false;
    for (let i = 1; i < path.length - 2; i++) {
      for (let j = i + 1; j < path.length - 1; j++) {
        const newPath = [...path.slice(0, i), ...path.slice(i, j + 1).reverse(), ...path.slice(j + 1)];
        const newDistance = calculateTotalDistance(cities, newPath);
        yield { type: 'CONSIDER', currentCity: i, nextCity: j, path: newPath, distance: newDistance };
        if (newDistance < totalDistance) {
          path = newPath;
          totalDistance = newDistance;
          improved = true;
          yield { type: 'VISIT', currentCity: i, nextCity: j, path: [...path], distance: totalDistance };
          break;
        }
      }
      if (improved) break;
    }
  }
  yield { type: 'COMPLETE', currentCity: -1, path: [...path], distance: totalDistance };
}
