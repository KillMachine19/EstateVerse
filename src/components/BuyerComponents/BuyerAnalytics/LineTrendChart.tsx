import React from 'react';

interface LineTrendChartProps {
  values: number[];
}

export const LineTrendChart: React.FC<LineTrendChartProps> = ({ values }) => {
  const width = 560;
  const height = 220;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 18) - 8;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="buyer-chart-svg buyer-chart-svg--line" role="img" aria-label="Trend chart">
      <defs>
        <linearGradient id="buyerLineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(249, 99, 50, 0.45)" />
          <stop offset="100%" stopColor="rgba(249, 99, 50, 0.05)" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="#f96332" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#buyerLineGradient)" />
    </svg>
  );
};
