import React from 'react';
import Hero from '../components/home/Hero';
import StartToPlay from '../components/home/StartToPlay';
import Advantages from '../components/home/Advantages';
import Subscriptions from '../components/home/Subscriptions';
import Wall from '../components/home/Wall';
import CtaSection from '../components/home/TryFree';
import { NavigateOptions } from '../types';

interface HomePageProps {
  navigate: (page: string, options?: NavigateOptions) => void;
  t: (key: string) => string;
}

const HomePage: React.FC<HomePageProps> = ({ navigate, t }) => {
  return (
    <div>
      <Hero navigate={navigate} t={t} />
      <StartToPlay navigate={navigate} t={t} />
      <Advantages navigate={navigate} t={t} />
      <Subscriptions navigate={navigate} t={t} />
      <Wall navigate={navigate} t={t} />
      <CtaSection navigate={navigate} t={t} />
    </div>
  );
};

export default HomePage;
