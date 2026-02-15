import type { City, TSPStep } from './types';
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
let bestEverPath: number[] = [];

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
