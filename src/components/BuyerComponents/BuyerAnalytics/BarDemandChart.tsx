import React from 'react';

interface BarDemandChartProps {
  values: number[];
  labels: string[];
}

export const BarDemandChart: React.FC<BarDemandChartProps> = ({ values, labels }) => {
  const max = Math.max(...values, 1);

  return (
    <div className="buyer-bar-chart" role="img" aria-label="Demand distribution chart">
      {values.map((value, index) => {
        const height = Math.max((value / max) * 100, 8);
        return (
          <div key={labels[index]} className="buyer-bar-chart__item">
            <div className="buyer-bar-chart__bar-wrap">
              <div className="buyer-bar-chart__bar" style={{ height: `${height}%` }} />
            </div>
            <span className="buyer-bar-chart__label">{labels[index]}</span>
          </div>
        );
      })}
    </div>
  );
};
