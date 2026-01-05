
import React, { useState, useEffect, useCallback } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuoteItem {
  type: 'award' | 'testimonial';
  quote: string;
  attribution: string;
  subAttribution?: string;
}

const QUOTES: QuoteItem[] = [
  {
    type: 'award',
    quote: "AK Pandey’s ability both to spot market opportunities for expanding legal practices and to deploy AI and proprietary data exemplifies how a legal office can establish a position in the new AI economy.",
    attribution: "Most Innovative Legal Counsel in South Asia 2025",
    subAttribution: "THE TAX JOURNAL"
  },
  {
    type: 'testimonial',
    quote: "Advocate Pandey's strategic intervention in our cross-border tax dispute was nothing short of brilliant. His team navigates complex regulatory frameworks with clinical precision.",
    attribution: "Aditya Vardhan"
  },
  {
    type: 'testimonial',
    quote: "The level of discretion and high-stakes strategy provided by AK Pandey & Associates is unparalleled in the region. They are our first choice for constitutional matters.",
    attribution: "Sarah Mendonsa"
  },
  {
    type: 'testimonial',
    quote: "Precision, integrity, and deep sector expertise. They don't just provide legal advice; they provide a roadmap for institutional stability.",
    attribution: "Vikram Malhotra"
  }
];

const QuotesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + QUOTES.length) % QUOTES.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const current = QUOTES[currentIndex];

  return (
    <section className="py-12 md:py-16 bg-slate-50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 relative">
        
        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 flex justify-between pointer-events-none px-4 md:px-6">
          <button 
            onClick={prevSlide}
            className="p-2.5 bg-white/70 backdrop-blur-sm border border-slate-100 hover:bg-white hover:text-[#CC1414] transition-all pointer-events-auto shadow-sm rounded-full group"
          >
            <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-2.5 bg-white/70 backdrop-blur-sm border border-slate-100 hover:bg-white hover:text-[#CC1414] transition-all pointer-events-auto shadow-sm rounded-full group"
          >
            <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-white p-10 lg:p-16 shadow-sm relative border border-slate-100 min-h-[350px] flex flex-col justify-center items-center">
          
          <div className="absolute top-8 left-8 text-slate-50 opacity-10">
            <Quote size={100} fill="currentColor" />
          </div>

          <div className={`text-center max-w-4xl mx-auto transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-2 scale-[0.98]' : 'opacity-100 transform translate-y-0 scale-100'}`}>
            
            {current.type === 'award' && (
              <div className="mb-6">
                <span className="text-[9px] font-bold tracking-[0.4em] text-[#CC1414] uppercase bg-red-50 px-3 py-1.5 rounded-full">GLOBAL RECOGNITION</span>
              </div>
            )}

            <blockquote className="text-xl lg:text-3xl font-serif italic text-slate-800 leading-[1.5] mb-8">
              “{current.quote}”
            </blockquote>

            <div className="flex flex-col items-center">
              <p className="text-lg lg:text-xl font-serif text-slate-900 mb-1.5">
                {current.attribution}
              </p>
              {current.subAttribution && (
                <p className="text-[10px] font-bold tracking-[0.4em] text-[#CC1414] uppercase">
                  {current.subAttribution}
                </p>
              )}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 flex justify-center space-x-2">
            {QUOTES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (isAnimating) return;
                  setIsAnimating(true);
                  setCurrentIndex(idx);
                  setTimeout(() => setIsAnimating(false), 700);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentIndex === idx ? 'bg-[#CC1414] w-5' : 'bg-slate-200 hover:bg-slate-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuotesCarousel;
