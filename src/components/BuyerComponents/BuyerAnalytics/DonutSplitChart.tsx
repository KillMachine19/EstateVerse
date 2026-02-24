import React from 'react';

interface DonutSplitChartProps {
  primary: number;
  secondary: number;
  tertiary: number;
}

export const DonutSplitChart: React.FC<DonutSplitChartProps> = ({ primary, secondary, tertiary }) => {
  const total = primary + secondary + tertiary || 1;
  const p1 = (primary / total) * 100;
  const p2 = (secondary / total) * 100;

  return (
    <div className="buyer-donut-chart">
      <div
        className="buyer-donut-chart__ring"
        style={{
          background: `conic-gradient(#2ca8ff 0 ${p1}%, #18ce0f ${p1}% ${p1 + p2}%, #f96332 ${p1 + p2}% 100%)`,
        }}
      >
        <div className="buyer-donut-chart__inner">{Math.round(p1)}%</div>
      </div>
      <ul className="buyer-donut-chart__legend">
        <li><span className="dot dot--blue" /> Offices</li>
        <li><span className="dot dot--green" /> Retail</li>
        <li><span className="dot dot--orange" /> Warehouses</li>
      </ul>
    </div>
  );
};
