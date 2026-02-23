import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { ScheduleCall } from '../components/ScheduleCall';

export const Home: React.FC = () => {
  return (
    <main className="flex-grow">
      <HeroSection />
      <FeaturesSection />
      <ScheduleCall triggerClassName="sc-trigger-floating" />
    </main>
  );
};
