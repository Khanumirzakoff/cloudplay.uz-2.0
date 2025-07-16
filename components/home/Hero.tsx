
import React from 'react';

interface HeroProps {
    navigate: (page: string) => void;
    t: (key: string) => string;
}

const Hero: React.FC<HeroProps> = ({ navigate, t }) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center text-center -mt-[72px] pt-[72px] overflow-hidden bg-background">
            <div className="absolute inset-0 w-full h-full bg-hero-pattern bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <h1 className="font-orbitron text-5xl md:text-7xl font-bold uppercase mb-4 tracking-wider animate-glow">
                    <span className="text-white">CLOUD</span><span className="text-primary">PLAY</span>
                </h1>
                <p className="text-lg md:text-2xl text-gray-300 tracking-widest uppercase">
                    {t('heroSubtitle')}
                </p>
                <div className="mt-12 flex justify-center">
                     <a href="#" onClick={(e) => { e.preventDefault(); navigate('games'); }} className="bg-primary text-black font-bold text-lg rounded-lg px-10 py-4 transition-all shadow-glow-primary transform hover:scale-105">
                        {t('registerAndPlay')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;
