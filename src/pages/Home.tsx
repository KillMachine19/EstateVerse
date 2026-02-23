import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';

export const Home: React.FC = () => {
  return (
    <main className="flex-grow">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
};
