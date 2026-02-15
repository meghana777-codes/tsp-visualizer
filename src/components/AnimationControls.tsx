interface AnimationControlsProps {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
}

export function AnimationControls({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
}: AnimationControlsProps) {

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg">

      {/* Step counter */}
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-3 mb-4">

        <button
          onClick={onStepBackward}
          disabled={isPlaying || currentStep === 0}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        >
          ⏮ Back
        </button>

        <button
          onClick={onPlayPause}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={onStepForward}
          disabled={isPlaying || currentStep >= totalSteps}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        >
          Next ⏭
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
        >
          🔄 Reset
        </button>

      </div>

      {/* Speed slider */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600 w-16">Speed:</span>
        <input
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-bold text-blue-600 w-10">{speed}x</span>
      </div>

    </div>
  );
}