import React, { useState, useRef, useEffect, useCallback } from 'react';

const PrevButton: React.FC<{ onClick: () => void; disabled: boolean }> = ({ onClick, disabled }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`absolute top-1/2 -left-4 -translate-y-1/2 z-20 p-2 bg-black/60 rounded-full text-white hover:bg-black/90 transition-all duration-300 ${disabled ? 'opacity-0 scale-50 cursor-not-allowed' : 'opacity-100 scale-100'}`}
        aria-label="Previous slide"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    </button>
);

const NextButton: React.FC<{ onClick: () => void; disabled: boolean }> = ({ onClick, disabled }) => (
     <button 
        onClick={onClick}
        disabled={disabled}
        className={`absolute top-1/2 -right-4 -translate-y-1/2 z-20 p-2 bg-black/60 rounded-full text-white hover:bg-black/90 transition-all duration-300 ${disabled ? 'opacity-0 scale-50 cursor-not-allowed' : 'opacity-100 scale-100'}`}
        aria-label="Next slide"
    >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </button>
);

interface GameCarouselProps {
    children: React.ReactNode;
}

const GameCarousel: React.FC<GameCarouselProps> = ({ children }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const checkScrollPosition = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            // A small tolerance for floating point inaccuracies
            const scrollEndReached = scrollLeft + clientWidth >= scrollWidth - 2;
            setIsAtStart(scrollLeft <= 0);
            setIsAtEnd(scrollEndReached);
        }
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition, { passive: true });
            const resizeObserver = new ResizeObserver(checkScrollPosition);
            resizeObserver.observe(container);
            checkScrollPosition(); // Initial check
            
            return () => {
                container.removeEventListener('scroll', checkScrollPosition);
                resizeObserver.disconnect();
            };
        }
    }, [checkScrollPosition, children]);


    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; // Scroll by 80% of visible width
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };
    
    return (
        <div className="relative group/carousel">
            <div 
                ref={scrollContainerRef} 
                className="flex space-x-4 pb-4 overflow-x-auto scroll-smooth no-scrollbar"
            >
                {children}
            </div>
             <div className="hidden md:block opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
                <PrevButton onClick={() => scroll('left')} disabled={isAtStart} />
                <NextButton onClick={() => scroll('right')} disabled={isAtEnd} />
            </div>
        </div>
    );
};

// Hide scrollbar utility style injected once
if (!document.querySelector('#no-scrollbar-style')) {
    const style = document.createElement('style');
    style.id = 'no-scrollbar-style';
    style.textContent = `
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `;
    document.head.appendChild(style);
}

export default GameCarousel;
