
import React, 'react';
import { Game, Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { loggingService } from '../services/loggingService';

interface GameCardProps {
    game: Game;
    onClick?: (game: Game) => void;
    language?: Language;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick, language = 'ENG' }) => {
    const { t } = useTranslation(language);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (onClick) {
            onClick(game);
        }
    };

    return (
        <a
            href="#"
            onClick={handleClick}
            className="group block relative rounded-lg overflow-hidden shrink-0 aspect-square cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onClick) {
                        onClick(game);
                    }
                }
            }}
            aria-label={`${game.title} o'yinini ochish`}
        >
            <div className="absolute -inset-px bg-glow-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            <div className="relative w-full h-full bg-surface rounded-md">
                <img
                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
                    src={game.image}
                    alt={game.title}
                    loading="lazy"
                />
                
                {/* Game info overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="font-bold text-white text-base leading-tight drop-shadow-md">{game.title}</div>
                    <div className="text-gray-400 text-xs mt-1 truncate">{game.genres.join(', ')}</div>
                    
                    {/* Game badges */}
                    <div className="flex items-center gap-2 mt-2">
                        {game.isFree && (
                            <span className="bg-primary text-black text-xs px-2 py-1 rounded">
                                Bepul
                            </span>
                        )}
                        {game.rtx && (
                            <span className="bg-secondary text-white text-xs px-2 py-1 rounded">
                                RTX
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </a>
    );
};

export default GameCard;







