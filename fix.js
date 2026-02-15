import { writeFileSync } from 'fs';

writeFileSync('src/utils/distance.ts',
`import type { City } from '../algorithms/types';

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
`);

writeFileSync('src/algorithms/greedy.ts',
`import type { City, TSPStep } from './types';
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
`);

writeFileSync('src/algorithms/twoOpt.ts',
`import type { City, TSPStep } from './types';
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
`);

writeFileSync('src/algorithms/genetic.ts',
`import type { City, TSPStep } from './types';
import { calculateTotalDistance } from '../utils/distance';

export function* geneticAlgorithmTSP(cities: City[], populationSize = 80, generations = 300, mutationRate = 0.02): Generator<TSPStep> {
  let population = Array.from({ length: populationSize }, () => {
    const path = Array.from({ length: cities.length }, (_, i) => i);
    for (let i = 1; i < path.length; i++) {
      const j = 1 + Math.floor(Math.random() * (path.length - 1));
      [path[i], path[j]] = [path[j], path[i]];
    }
    path.push(0);
    return { path, fitness: 0 };
  });

  let bestEverDistance = Infinity;
  let bestEverPath = [];

  for (let gen = 0; gen < generations; gen++) {
    population = population.map(ind => ({ ...ind, fitness: 1 / calculateTotalDistance(cities, ind.path) }));
    population.sort((a, b) => b.fitness - a.fitness);
    const currentBest = 1 / population[0].fitness;
    if (currentBest < bestEverDistance) { bestEverDistance = currentBest; bestEverPath = [...population[0].path]; }
    yield { type: 'VISIT', currentCity: gen, path: population[0].path, distance: currentBest };

    const newPop = population.slice(0, Math.floor(populationSize * 0.1));
    while (newPop.length < populationSize) {
      const p1 = population[Math.floor(Math.random() * population.length)];
      const p2 = population[Math.floor(Math.random() * population.length)];
      const size = p1.path.length - 1;
      const start = 1 + Math.floor(Math.random() * (size - 2));
      const end = start + Math.floor(Math.random() * (size - start - 1));
      const child = Array(p1.path.length).fill(-1);
      child[0] = 0; child[child.length - 1] = 0;
      for (let i = start; i <= end; i++) child[i] = p1.path[i];
      let ci = 1;
      for (let i = 1; i < p2.path.length - 1; i++) {
        while (ci < size && child[ci] !== -1) ci++;
        if (ci >= size) break;
        if (!child.includes(p2.path[i])) { child[ci] = p2.path[i]; ci++; }
      }
      const mutated = [...child];
      for (let i = 1; i < mutated.length - 1; i++) {
        if (Math.random() < mutationRate) {
          const j = 1 + Math.floor(Math.random() * (mutated.length - 2));
          [mutated[i], mutated[j]] = [mutated[j], mutated[i]];
        }
      }
      newPop.push({ path: mutated, fitness: 0 });
    }
    population = newPop;
  }
  yield { type: 'COMPLETE', currentCity: -1, path: bestEverPath, distance: bestEverDistance };
}
`);

writeFileSync('src/utils/cityGenerator.ts',
`import type { City } from '../algorithms/types';

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
`);

console.log('✅ All files written successfully!');