import React from 'react';
import { FiClock } from 'react-icons/fi';
import { BarDemandChart } from './BarDemandChart';
import { ChartCard } from './ChartCard';
import { DonutSplitChart } from './DonutSplitChart';
import { LineTrendChart } from './LineTrendChart';
import './BuyerAnalytics.css';

const monthlyTraffic = [18, 26, 23, 31, 37, 41, 46, 44, 52, 58, 56, 63];

export const BuyerAnalytics: React.FC = () => {
  return (
    <div className="buyer-analytics">
      <section className="buyer-analytics-panel-header" aria-label="Buyer analytics trend overview">
        <div className="buyer-analytics-panel-header__content">
          <h2 className="buyer-analytics-panel-header__title">Buyer Demand Momentum</h2>
          <p className="buyer-analytics-panel-header__description">
            Your tracked market activity across shortlisted properties is trending up over the last 12 months.
          </p>
        </div>
        <div className="buyer-analytics-panel-header__chart">
          <LineTrendChart values={monthlyTraffic} />
        </div>
      </section>

      <section className="buyer-analytics-grid" aria-label="Buyer analytics charts">
        <ChartCard category="Traffic" title="Property View Trend" stats="Updated 5 minutes ago">
          <LineTrendChart values={[34, 38, 35, 41, 44, 48, 51, 49, 55, 59, 57, 64]} />
        </ChartCard>

        <ChartCard category="Preference" title="Category Demand Split" stats="Synced this morning">
          <DonutSplitChart primary={52} secondary={29} tertiary={19} />
        </ChartCard>

        <ChartCard category="Weekly Activity" title="Site Visits by Day" stats="Last 7 days">
          <BarDemandChart
            values={[14, 22, 18, 26, 19, 31, 24]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          />
        </ChartCard>
      </section>

      <section className="buyer-analytics-footnote" aria-label="Analytics update metadata">
        <FiClock aria-hidden="true" />
        <span>Analytics calculations refresh every 30 minutes.</span>
      </section>
    </div>
  );
};
