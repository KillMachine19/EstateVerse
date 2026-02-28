import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FloatingPageActions } from '../components/FloatingPageActions';

const ScrollToTopOnRouteChange: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export const Root: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTopOnRouteChange />
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <FloatingPageActions />
      <Footer />
    </div>
  );
};
