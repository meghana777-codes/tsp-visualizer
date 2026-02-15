import { useState } from 'react';

interface ControlPanelProps {
  onAlgorithmChange: (algorithm: string) => void;
  onCityCountChange: (count: number) => void;
  onGenerateCities: () => void;
  onRunAlgorithm: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export function ControlPanel({
  onAlgorithmChange,
  onCityCountChange,
  onGenerateCities,
  onRunAlgorithm,
  onReset,
  isRunning,
}: ControlPanelProps) {
  const [selectedAlgo, setSelectedAlgo] = useState('greedy');
  const [cityCount, setCityCount] = useState(10);

  const handleAlgoChange = (algo: string) => {
    setSelectedAlgo(algo);
    onAlgorithmChange(algo);
  };

  const handleCityCountChange = (count: number) => {
    setCityCount(count);
    onCityCountChange(count);
  };

  const algoInfo: Record<string, { complexity: string; quality: string; desc: string }> = {
    greedy: {
      complexity: 'O(n²)',
      quality: 'Approximate',
      desc: 'Always picks the nearest unvisited city. Fast but not optimal.',
    },
    '2opt': {
      complexity: 'O(n²) per iter',
      quality: 'Good',
      desc: 'Improves greedy solution by removing crossing paths.',
    },
    genetic: {
      complexity: 'O(g × p × n)',
      quality: 'Best',
      desc: 'Evolves population of tours over many generations.',
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-xl font-bold text-gray-800">⚙️ Controls</h2>

      {/* Algorithm Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Algorithm
        </label>
        <select
          value={selectedAlgo}
          onChange={(e) => handleAlgoChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="greedy">Greedy (Nearest Neighbor)</option>
          <option value="2opt">2-Opt Optimization</option>
          <option value="genetic">Genetic Algorithm</option>
        </select>

        {/* Algorithm Info Box */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-blue-700">
              {algoInfo[selectedAlgo].complexity}
            </span>
            <span className="text-green-600 font-semibold">
              {algoInfo[selectedAlgo].quality}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {algoInfo[selectedAlgo].desc}
          </p>
        </div>
      </div>

      {/* City Count Slider */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Number of Cities: <span className="text-blue-600">{cityCount}</span>
        </label>
        <input
          type="range"
          min="5"
          max="30"
          value={cityCount}
          onChange={(e) => handleCityCountChange(parseInt(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>5</span>
          <span>30</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={onGenerateCities}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          🎲 Generate Cities
        </button>

        <button
          onClick={onRunAlgorithm}
          disabled={isRunning}
          className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
        >
          {isRunning ? '⏳ Running...' : '▶️ Run Algorithm'}
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
        >
          🔄 Reset
        </button>
      </div>

      {/* Legend */}
      <div className="border-t pt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">LEGEND</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Start city</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Current city</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>Considering</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span>Unvisited</span>
          </div>
        </div>
      </div>

    </div>
  );
}