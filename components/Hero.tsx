import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { contentService } from '../services/contentService';
import { Insight, HeroContent } from '../types';

const Hero: React.FC = () => {
  // Separate state for the main configuration and the dynamic insights
  const [heroConfig, setHeroConfig] = useState<HeroContent | null>(null);
  const [heroInsights, setHeroInsights] = useState<Insight[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Subscribe to data streams independently
  useEffect(() => {
    const unsubHero = contentService.subscribeHero(setHeroConfig);
    const unsubInsights = contentService.subscribeHeroInsights(setHeroInsights);
    return () => {
      unsubHero();
      unsubInsights();
    };
  }, []);

  // Combine data into a single slides array whenever sources change
  const slides = useMemo(() => {
    const defaultSlide = {
      id: 'main-hero',
      title: heroConfig?.headline || "Strategic Legal Counsel for a Complex World",
      desc: heroConfig?.subtext || "Providing precise legal strategy and uncompromising advocacy for global enterprises and individuals.",
      image: heroConfig?.backgroundImage || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400",
      category: 'STRATEGIC BRIEFING',
      ctaText: heroConfig?.ctaText || "DISCUSS MANDATE"
    };

    const insightSlides = heroInsights.map(item => ({
      id: item.id,
      title: item.title,
      desc: item.desc,
      image: item.bannerImage || item.image,
      category: item.category || 'INSIGHT',
      ctaText: 'VIEW NOW'
    }));

    return [defaultSlide, ...insightSlides];
  }, [heroConfig, heroInsights]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  useEffect(() => {
    if (slides.length > 1) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(nextSlide, 8000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [slides.length, nextSlide]);

  if (slides.length === 0) return <div className="min-h-[85vh] bg-slate-900 animate-pulse"></div>;

  return (
    <div className="relative h-[85vh] min-h-[650px] w-full overflow-hidden bg-slate-900 flex items-center">
      
      {/* Background Images Layer */}
      {slides.map((slide, idx) => (
        <div 
          // Fix: Use slice(-20) to ensure uniqueness for base64 strings which share common prefixes
          key={`${slide.id}-bg-${idx}-${slide.image?.slice(-20)}`}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover object-center brightness-[0.55] ${idx === currentIndex ? 'animate-scale-out' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32 w-full pt-20">
        <div className="max-w-4xl">
          {slides.map((slide, idx) => (
            <div key={`${slide.id}-content-${idx}`} className={`${idx === currentIndex ? 'block' : 'hidden'}`}>
              
              <p className="text-[11px] font-bold tracking-[0.45em] uppercase text-white/60 mb-8 font-sans animate-reveal-up stagger-1">
                {slide.category}
              </p>
              
              <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-medium text-white leading-[1.05] font-sans tracking-tight mb-10 animate-reveal-up stagger-2 drop-shadow-2xl">
                {slide.title}
              </h1>
              
              <p className="text-[clamp(17px,1.5vw,22px)] text-white/70 mb-14 leading-relaxed font-light max-w-2xl font-sans animate-reveal-up stagger-3">
                {slide.desc}
              </p>
              
              <div className="flex items-center animate-reveal-up stagger-4">
                <button
                  className="group relative flex items-center gap-4 text-[13px] font-bold tracking-[0.3em] uppercase text-white py-2"
                >
                  <span className="relative z-10">{slide.ctaText}</span>
                  <div className="w-10 h-px bg-[#CC1414] group-hover:w-16 transition-all duration-700"></div>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls (Visible only if multiple slides) */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-6 md:left-12 lg:left-20 xl:left-32 z-20 flex items-center gap-8">
           <div className="flex items-center gap-4">
              <button onClick={prevSlide} className="p-2 text-white/30 hover:text-white transition-all"><ChevronLeft size={32} strokeWidth={1} /></button>
              <button onClick={nextSlide} className="p-2 text-white/30 hover:text-white transition-all"><ChevronRight size={32} strokeWidth={1} /></button>
           </div>
           
           {/* Progress Line */}
           <div className="flex items-end gap-1.5 h-6">
              {slides.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 transition-all duration-700 ${idx === currentIndex ? 'w-10 bg-[#CC1414]' : 'w-3 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
           </div>
        </div>
      )}

      {/* Metadata Detail */}
      <div className="absolute bottom-12 right-12 hidden lg:block animate-reveal-left stagger-4">
        <div className="flex flex-col items-end space-y-3">
          <div className="w-16 h-px bg-white/20"></div>
          <span className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">AK PANDEY STRATEGIC MANDATE</span>
        </div>
      </div>

    </div>
  );
};

export default Hero;