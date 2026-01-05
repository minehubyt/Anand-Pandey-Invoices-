
import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { Insight } from '../types';
import { RefreshCw } from 'lucide-react';

interface InsightsProps {
  onInsightClick: (item: Insight) => void;
}

const Insights: React.FC<InsightsProps> = ({ onInsightClick }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = contentService.subscribeInsights((data) => {
      const sorted = [...data].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setInsights(sorted.slice(0, 3));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="insights" className="py-24 md:py-32 bg-white min-h-[600px]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 animate-reveal-up">
          <h3 className="text-[clamp(2.5rem,4vw,3.5rem)] font-serif text-slate-900 leading-tight">
            Expert Briefings
          </h3>
          <button className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-400 border-b border-slate-100 pb-1.5 hover:text-[#CC1414] hover:border-[#CC1414] transition-all whitespace-nowrap">
            EXPLORE ALL THINKING
          </button>
        </div>
        
        {loading && insights.length === 0 ? (
          <div className="flex justify-center py-40">
            <RefreshCw className="w-8 h-8 animate-spin text-slate-200" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-20">
            {insights.length === 0 && !loading && (
              <div className="col-span-3 text-center py-20 text-slate-300 font-serif italic text-xl">
                The strategic briefings desk is currently being updated.
              </div>
            )}
            {insights.map((item, idx) => (
              <div 
                key={item.id} 
                className={`group cursor-pointer animate-reveal-up stagger-${idx + 1}`} 
                onClick={() => onInsightClick(item)}
              >
                <div className="aspect-[4/3] overflow-hidden mb-8 relative bg-slate-100 shadow-sm rounded-sm">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[3s] ease-out"
                  />
                  <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-1000"></div>
                </div>
                
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#CC1414]">
                    {item.category}
                  </span>
                  <span className="text-slate-300">—</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h3 className="text-2xl font-serif text-slate-900 leading-[1.25] group-hover:text-[#CC1414] transition-colors duration-500 mb-5">
                  {item.title}
                </h3>

                <p className="text-slate-500 font-light text-[15px] leading-relaxed mb-8 line-clamp-3">
                  {item.desc}
                </p>
                
                <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.35em] uppercase text-slate-900 group-hover:text-[#CC1414] transition-all">
                  <span>READ MORE</span>
                  <div className="w-8 h-px bg-slate-100 group-hover:bg-[#CC1414] group-hover:w-12 transition-all duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Insights;
