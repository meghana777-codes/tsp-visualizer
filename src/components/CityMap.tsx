import type { City } from '../algorithms/types';

interface CityMapProps {
  cities: City[];
  path: number[];
  currentCity?: number;
  consideringCity?: number;
  width?: number;
  height?: number;
}

export function CityMap({
  cities,
  path,
  currentCity,
  consideringCity,
  width = 750,
  height = 550,
}: CityMapProps) {

  // Build SVG path string from city indices
  function buildPathD(indices: number[]): string {
    if (indices.length < 2) return '';
    const first = cities[indices[0]];
    let d = `M ${first.x} ${first.y}`;
    for (let i = 1; i < indices.length; i++) {
      const c = cities[indices[i]];
      d += ` L ${c.x} ${c.y}`;
    }
    return d;
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
      <svg
        width={width}
        height={height}
        className="bg-gradient-to-br from-slate-50 to-blue-50"
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Tour path (solid blue line) */}
        {path.length > 1 && (
          <path
            d={buildPathD(path)}
            stroke="#3b82f6"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        )}

        {/* Consideration line (dashed red) */}
        {currentCity !== undefined &&
          consideringCity !== undefined &&
          cities[currentCity] &&
          cities[consideringCity] && (
            <line
              x1={cities[currentCity].x}
              y1={cities[currentCity].y}
              x2={cities[consideringCity].x}
              y2={cities[consideringCity].y}
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="6,4"
              opacity="0.7"
            />
          )}

        {/* Cities */}
        {cities.map((city, index) => {
          const isStart = index === 0;
          const isCurrent = currentCity === index;
          const isConsidering = consideringCity === index;
          const isInPath = path.includes(index);

          // Pick color based on state
          const color = isStart
            ? '#10b981'      // green
            : isCurrent
            ? '#ef4444'      // red
            : isConsidering
            ? '#f59e0b'      // yellow
            : isInPath
            ? '#3b82f6'      // blue
            : '#9ca3af';     // gray

          const radius = isCurrent ? 13 : 9;

          return (
            <g key={city.id}>
              {/* Glow effect for current city */}
              {isCurrent && (
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={20}
                  fill={color}
                  opacity="0.2"
                />
              )}

              {/* City circle */}
              <circle
                cx={city.x}
                cy={city.y}
                r={radius}
                fill={color}
                stroke="white"
                strokeWidth="2.5"
              />

              {/* City label */}
              <text
                x={city.x}
                y={city.y - 16}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#1e293b"
              >
                {city.name}
              </text>
            </g>
          );
        })}

        {/* Empty state message */}
        {cities.length === 0 && (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            fontSize="18"
            fill="#94a3b8"
          >
            Click "Generate Cities" to start
          </text>
        )}
      </svg>
    </div>
  );
}