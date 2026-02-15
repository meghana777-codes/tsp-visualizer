import { useState, useEffect, useRef } from 'react';
import type { City, TSPStep } from './algorithms/types';
import { greedyTSP } from './algorithms/greedy';
import { twoOptOptimize } from './algorithms/twoOpt';
import { geneticAlgorithmTSP } from './algorithms/genetic';
import { generateRandomCities } from './utils/cityGenerator';
import { CityMap } from './components/CityMap';
import { ControlPanel } from './components/ControlPanel';
import { AnimationControls } from './components/AnimationControls';
import { StatsDisplay } from './components/StatsDisplay';

function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [cityCount, setCityCount] = useState(10);
  const [algorithm, setAlgorithm] = useState('greedy');
  const [steps, setSteps] = useState<TSPStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate cities on first load
 

  // Handle auto-play
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 200 / speed);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const handleGenerateCities = () =>
     {
    const newCities = generateRandomCities(cityCount);
    setCities(newCities);
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };
   useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);      
            return prev;
          }
          return prev + 1;
        });
      }, 200 / speed);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const handleRunAlgorithm = () => {
    if (cities.length === 0) return;
    setIsRunning(true);
    setIsPlaying(false);
    setCurrentStepIndex(0);

    // Collect all steps from generator
    const allSteps: TSPStep[] = [];

    if (algorithm === 'greedy') {
      for (const step of greedyTSP(cities)) {
        allSteps.push(step);
      }
      setSteps(allSteps);

    } else if (algorithm === '2opt') {
      // First run greedy to get initial path
      let initialPath: number[] = [];
      for (const step of greedyTSP(cities)) {
        if (step.type === 'COMPLETE') initialPath = step.path;
      }
      for (const step of twoOptOptimize(cities, initialPath)) {
        allSteps.push(step);
      }
      setSteps(allSteps);

    } else if (algorithm === 'genetic') {
      for (const step of geneticAlgorithmTSP(cities, 50, 150, 0.02)) {
        allSteps.push(step);
      }
      setSteps(allSteps);
    }

    setIsRunning(false);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Current frame of animation
  const currentStep = steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🗺️ TSP Algorithm Visualizer
          </h1>
          <p className="text-gray-500">
            Traveling Salesman Problem — watch algorithms find the shortest route in real time
          </p>
        </div>

        {/* Stats */}
        <StatsDisplay
          distance={currentStep?.distance ?? 0}
          algorithm={algorithm}
          cities={cities.length}
        />

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Map — takes 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            <CityMap
              cities={cities}
              path={currentStep?.path ?? []}
              currentCity={currentStep?.currentCity}
              consideringCity={currentStep?.nextCity}
            />

            <AnimationControls
              isPlaying={isPlaying}
              speed={speed}
              currentStep={currentStepIndex}
              totalSteps={steps.length}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onReset={handleReset}
              onStepForward={() =>
                setCurrentStepIndex((p) => Math.min(p + 1, steps.length - 1))
              }
              onStepBackward={() =>
                setCurrentStepIndex((p) => Math.max(p - 1, 0))
              }
              onSpeedChange={setSpeed}
            />
          </div>

          {/* Controls — 1 column */}
          <div>
            <ControlPanel
              onAlgorithmChange={setAlgorithm}
              onCityCountChange={setCityCount}
              onGenerateCities={handleGenerateCities}
              onRunAlgorithm={handleRunAlgorithm}
              onReset={handleReset}
              isRunning={isRunning}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;

