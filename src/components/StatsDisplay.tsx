interface StatsDisplayProps {
  distance: number;
  algorithm: string;
  cities: number;
}

export function StatsDisplay({ distance, algorithm, cities }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">

      {/* Total Distance */}
      <div className="bg-blue-600 p-4 rounded-xl text-white shadow-lg">
        <div className="text-sm opacity-80">Total Distance</div>
        <div className="text-3xl font-bold mt-1">
          {distance > 0 ? Math.round(distance) : '—'}
        </div>
        <div className="text-xs opacity-60 mt-1">pixels</div>
      </div>

      {/* Algorithm */}
      <div className="bg-purple-600 p-4 rounded-xl text-white shadow-lg">
        <div className="text-sm opacity-80">Algorithm</div>
        <div className="text-xl font-bold mt-1 capitalize">{algorithm}</div>
        <div className="text-xs opacity-60 mt-1">selected</div>
      </div>

      {/* Cities */}
      <div className="bg-green-600 p-4 rounded-xl text-white shadow-lg">
        <div className="text-sm opacity-80">Cities</div>
        <div className="text-3xl font-bold mt-1">{cities}</div>
        <div className="text-xs opacity-60 mt-1">total</div>
      </div>

    </div>
  );
}