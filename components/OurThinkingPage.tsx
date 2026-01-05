
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, BookOpen, Mic, FileText, Sparkles, 
  Download, Play, ArrowRight, Search, RefreshCw, 
  Calendar, Share2, List, Volume2, SkipBack, SkipForward,
  ChevronRight, Linkedin, Facebook, Instagram
} from 'lucide-react';
import { contentService } from '../services/contentService';
import { Insight } from '../types';

interface OurThinkingPageProps {
  onBack: () => void;
  onInsightClick: (item: Insight) => void;
}

const OurThinkingPage: React.FC<OurThinkingPageProps> = ({ onBack, onInsightClick }) => {
  const [activeCategory, setActiveCategory] = useState('FEATURED INSIGHTS');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = contentService.subscribeInsights((data) => {
      setInsights(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const menuItems = [
    'FEATURED INSIGHTS',
    'EXPLORE ALL',
    'RESOURCES & TOOLS',
    'BOOK OF JARGON® SERIES',
    'BLOGS',
    'PODCASTS',
    'WEBCASTS'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <RefreshCw className="w-10 h-10 animate-spin text-slate-200" />
      </div>
    );
  }

  const getFilteredInsights = () => {
    if (activeCategory === 'FEATURED INSIGHTS') return insights.filter(i => i.isFeatured);
    if (activeCategory === 'PODCASTS') return insights.filter(i => i.type === 'podcasts');
    if (activeCategory === 'RESOURCES & TOOLS') return insights.filter(i => i.type === 'reports');
    return insights;
  };

  const filtered = getFilteredInsights();

  return (
    <div className="animate-page-fade bg-white min-h-screen font-sans selection:bg-[#CC1414] selection:text-white">
      
      {/* 1. CINEMATIC HEADER SECTION */}
      <section className="relative min-h-[500px] bg-[#050608] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00249c]/30 via-transparent to-[#e34234]/20 opacity-60" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-1 bg-gradient-to-r from-transparent via-[#506eff] to-transparent rotate-[-40deg] blur-sm opacity-40" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32 w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          <div className="animate-reveal-up">
             <button onClick={onBack} className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors mb-20">
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN</span>
            </button>
            <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-sans font-light text-white leading-none tracking-tight">Insights</h1>
          </div>

          <nav className="flex flex-col items-center md:items-end space-y-4 animate-reveal-left stagger-2 pt-20">
            {menuItems.map((item) => (
              <button key={item} onClick={() => setActiveCategory(item)} className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all pb-1.5 border-b-2 ${activeCategory === item ? 'text-white border-white' : 'text-white/40 border-transparent hover:text-white'}`}>
                {item}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* 2. DYNAMIC GRID SECTION */}
      <section className="py-20 bg-[#f4f4f4]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filtered.map((item, idx) => (
              <div key={item.id} className="group cursor-pointer flex flex-col" onClick={() => onInsightClick(item)}>
                <div className="aspect-[16/9] overflow-hidden bg-slate-200 mb-6 relative">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={item.title} />
                  {item.type === 'podcasts' && <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white"><Mic size={16}/></div>}
                </div>
                <div className="space-y-4">
                  <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">{new Date(item.date).toLocaleDateString()} | {item.category.toUpperCase()}</p>
                  <h3 className="text-xl font-sans font-medium leading-tight text-slate-900 group-hover:text-[#CC1414] transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-light line-clamp-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default OurThinkingPage;
