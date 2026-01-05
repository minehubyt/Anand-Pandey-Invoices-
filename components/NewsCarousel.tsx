
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { contentService } from '../services/contentService';
import { Insight } from '../types';

interface NewsCarouselProps {
  onInsightClick: (item: Insight) => void;
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ onInsightClick }) => {
  const [newsItems, setNewsItems] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const unsubscribe = contentService.subscribeFeaturedInsights((data) => {
      setNewsItems(data);
      if (data.length > 0) {
        // Initialize position in the middle of extended items for loop effect
        setCurrentIndex(data.length);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const nextSlide = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  useEffect(() => {
    if (newsItems.length > 0) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(nextSlide, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [newsItems, nextSlide]);

  const handleTransitionEnd = () => {
    if (currentIndex >= newsItems.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - newsItems.length);
    } else if (currentIndex < newsItems.length) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + newsItems.length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 20);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  if (loading) return (
    <div className="h-[500px] flex items-center justify-center bg-white border-b border-slate-100">
      <RefreshCw className="animate-spin text-slate-200 w-10 h-10" />
    </div>
  );
  
  if (newsItems.length === 0) return null;

  const extendedItems = [...newsItems, ...newsItems, ...newsItems];
  const slideWidth = 75; 
  const sidePeek = (100 - slideWidth) / 2;

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden select-none">
      <div className="relative w-full">
        <div 
          className={`flex ${isTransitioning ? 'transition-transform duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)]' : ''}`}
          onTransitionEnd={handleTransitionEnd}
          style={{ transform: `translateX(calc(${sidePeek}vw - ${currentIndex * slideWidth}vw))` }}
        >
          {extendedItems.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <div key={index} className={`flex-none w-[75vw] px-2 md:px-4 transition-all duration-[900ms] ${isActive ? 'scale-100 opacity-100' : 'scale-[0.92] opacity-50'}`}>
                <div 
                  className={`relative w-full aspect-[16/8] min-h-[400px] md:min-h-[550px] overflow-hidden group rounded-sm shadow-2xl cursor-pointer ${item.featuredColor || 'bg-slate-900'}`}
                  onClick={() => isActive && onInsightClick(item)}
                >
                  <img src={item.bannerImage || item.image} className={`absolute inset-0 w-full h-full object-cover transition-all duration-[4s] ease-out ${isActive ? 'opacity-60 scale-100 group-hover:scale-105' : 'opacity-30 scale-110'}`} alt={item.title} />
                  {!isActive && <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-700" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20" />
                  <div className={`relative z-30 h-full flex flex-col justify-center px-8 md:px-20 max-w-4xl text-white transition-all duration-[1s] ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                    <p className="text-[10px] md:text-[13px] font-bold tracking-[0.35em] uppercase mb-6 text-white/90 drop-shadow-sm">{item.featuredLabel || item.category}</p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans font-medium mb-12 leading-[1.1] tracking-tight drop-shadow-lg">{item.title}</h2>
                    <button onClick={(e) => { e.stopPropagation(); onInsightClick(item); }} className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] uppercase border-b-2 border-white pb-1.5 inline-block hover:text-[#CC1414] hover:border-[#CC1414] transition-all self-start">READ MORE</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewsCarousel;
