import type { City, TSPStep } from "./types";
import { calculateTotalDistance } from "../utils/distance";

export function* geneticAlgorithmTSP(
  cities: City[],
  populationSize = 80,
  generations = 300,
  mutationRate = 0.02
): Generator<TSPStep> {
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
  let bestEverPath: number[]=[];

  for (let gen = 0; gen < generations; gen++) {
    population = population.map((ind) => ({
      ...ind,
      fitness: 1 / calculateTotalDistance(cities, ind.path),
    }));

    population.sort((a, b) => b.fitness - a.fitness);

    const currentBest = 1 / population[0].fitness;

    if (currentBest < bestEverDistance) {
      bestEverDistance = currentBest;
      bestEverPath = [...population[0].path];
    }

    yield {
    type: "COMPLETE",
    currentCity: -1,
    path: bestEverPath,
    distance: bestEverDistance,
    };


    const newPop = population.slice(0, Math.floor(populationSize * 0.1));

    while (newPop.length < populationSize) {
      const p1 =
        population[Math.floor(Math.random() * population.length)];
      const p2 =
        population[Math.floor(Math.random() * population.length)];

      const size = p1.path.length - 1;
      const start = 1 + Math.floor(Math.random() * (size - 2));
      const end = start + Math.floor(Math.random() * (size - start - 1));

      const childPath = Array(size).fill(-1);
      childPath[0] = 0;

      for (let i = start; i <= end; i++) {
        childPath[i] = p1.path[i];
      }

      let currentIndex = 1;
      for (let i = 1; i < size; i++) {
        if (!childPath.includes(p2.path[i])) {
          while (childPath[currentIndex] !== -1) {
            currentIndex++;
          }
          childPath[currentIndex] = p2.path[i];
        }
      }

      childPath.push(0);

      if (Math.random() < mutationRate) {
        const i = 1 + Math.floor(Math.random() * (size - 1));
        const j = 1 + Math.floor(Math.random() * (size - 1));
        [childPath[i], childPath[j]] = [childPath[j], childPath[i]];
      }

      newPop.push({ path: childPath, fitness: 0 });
    }

    population = newPop;
  }

  yield {
    type: "COMPLETE",
    currentCity: -1,
    path: bestEverPath,
    distance: bestEverDistance,
  };
}
