
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Printer, Linkedin, Facebook, Twitter, Mail, Download, RefreshCw, User, Music, FileText, Calendar, Clock } from 'lucide-react';
import { contentService } from '../services/contentService';
import { Insight, Author } from '../types';

interface InsightDetailProps {
  id?: string;
  onBack: () => void;
}

const InsightDetail: React.FC<InsightDetailProps> = ({ id, onBack }) => {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  // Consistent slug generation
  const createSlug = (text: string) => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    const unsub = contentService.subscribeInsights((allInsights) => {
      // Find by Exact ID OR by Title Slug (for clean URLs)
      const found = allInsights.find(i => i.id === id || createSlug(i.title) === id);
      
      if (found) {
        setInsight(found);
        document.title = `${found.title} | AK Pandey & Associates`;
        
        // Fetch author if exists
        if (found.authorId) {
          contentService.subscribeAuthors((allAuthors) => {
            const authFound = allAuthors.find(a => a.id === found.authorId);
            if (authFound) setAuthor(authFound);
          });
        }
      }
      setLoading(false);
    });
    
    return () => unsub();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20">
      <RefreshCw className="w-12 h-12 animate-spin text-slate-200" />
    </div>
  );

  if (!insight) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center pt-40 animate-fade-in">
      <h2 className="text-4xl font-serif text-slate-900 mb-6">Mandate Not Found</h2>
      <p className="text-slate-500 mb-12">The dossier you are looking for does not match our current database records.</p>
      <button onClick={onBack} className="px-10 py-4 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#CC1414] transition-colors">RETURN TO THINKING</button>
    </div>
  );

  return (
    <div className="pt-40 pb-32 animate-page-fade">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        
        {/* Breadcrumb / Back Link */}
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 hover:text-[#CC1414] transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO THINKING</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-24">
          
          {/* Side Icons - Fixed width sidebar */}
          <aside className="hidden lg:flex flex-col space-y-8 pt-4 w-12 shrink-0">
             {insight.pdfUrl && (
               <a href={insight.pdfUrl} download className="text-slate-400 hover:text-[#CC1414] transition-colors" title="Download Report">
                 <Download className="w-5 h-5" />
               </a>
             )}
             <button onClick={() => window.print()} className="text-slate-400 hover:text-[#CC1414] transition-colors" title="Print Mandate"><Printer className="w-5 h-5" /></button>
             <div className="h-px w-full bg-slate-100"></div>
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors"><Linkedin className="w-5 h-5" /></button>
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors"><Facebook className="w-5 h-5" /></button>
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors"><Twitter className="w-5 h-5" /></button>
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors"><Mail className="w-5 h-5" /></button>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            
            <header className="mb-12 max-w-5xl">
              <div className="flex items-center gap-4 mb-4">
                <p className="text-[12px] font-bold tracking-[0.3em] uppercase text-[#CC1414]">{insight.category}</p>
                {insight.type === 'podcasts' && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest">S{insight.season} E{insight.episode}</span>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-slate-900 leading-[1.1] mb-8">
                {insight.title}
              </h1>
              <div className="flex items-center gap-6 text-slate-400 font-light italic text-sm">
                <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(insight.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-2"><Clock size={14}/> 6 Min Read</span>
              </div>
            </header>

            {/* Hero Image / Podcast Player */}
            <div className="aspect-[21/9] w-full bg-slate-900 overflow-hidden mb-16 shadow-2xl relative group">
               <img src={insight.bannerImage || insight.image} alt={insight.title} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[3s]" />
               
               {insight.type === 'podcasts' && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                       <Music size={40} />
                    </button>
                 </div>
               )}
            </div>

            <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
              <div className="flex-1 max-w-4xl">
                
                {/* Executive Summary */}
                <div className="bg-slate-50 border border-slate-100 p-8 lg:p-12 mb-16 relative shadow-sm">
                  <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#CC1414] mb-8">EXECUTIVE SUMMARY</h2>
                  <p className="text-xl text-slate-700 font-light leading-relaxed italic">
                    {insight.desc}
                  </p>
                </div>

                {/* Body Text / Strategic Narrative */}
                <article className="prose prose-slate prose-lg max-w-none text-slate-800 font-light leading-relaxed space-y-8">
                  <div className="whitespace-pre-line text-lg">
                    {insight.content || "The strategic narrative for this mandate is currently being finalized by the Lead Counsel. Please check back shortly for the full briefing."}
                  </div>
                  
                  {insight.type === 'reports' && (
                    <div className="p-12 bg-red-50/30 border border-red-100 flex flex-col items-center text-center gap-8 rounded-3xl">
                       <FileText size={64} className="text-[#CC1414] opacity-20" />
                       <h3 className="text-2xl font-serif">Comprehensive Report Available</h3>
                       <p className="text-slate-500 font-light max-w-md">Access the complete institutional analysis including proprietary data and cross-jurisdictional benchmarks.</p>
                       <button className="px-12 py-5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest shadow-xl hover:bg-[#CC1414] transition-colors">DOWNLOAD PDF DOCUMENT</button>
                    </div>
                  )}
                </article>
              </div>

              {/* Author / Contact Sidebar */}
              <div className="w-full lg:w-80 shrink-0">
                 <div className="border-t-2 border-[#CC1414] pt-10 lg:sticky lg:top-32">
                    <h4 className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-10">STRATEGIC CONTACT</h4>
                    <div className="space-y-12">
                       {author ? (
                         <div className="group">
                           <div className="w-24 h-24 rounded-2xl overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-700">
                             <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                           </div>
                           <p className="text-slate-900 font-serif text-2xl mb-1 group-hover:text-[#CC1414] transition-colors cursor-pointer">{author.name}</p>
                           <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-4">{author.title}</p>
                           <div className="space-y-1">
                             <p className="text-sm text-slate-600 font-light hover:text-[#CC1414] cursor-pointer transition-colors">{author.email}</p>
                             <p className="text-sm text-slate-600 font-light underline underline-offset-4 decoration-slate-100 hover:decoration-[#CC1414] transition-all cursor-pointer">View Dossier &rarr;</p>
                           </div>
                         </div>
                       ) : (
                         <div className="group">
                           <p className="text-slate-900 font-serif text-2xl mb-1 group-hover:text-[#CC1414] transition-colors cursor-pointer">Lead Counsel Desk</p>
                           <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-4">CHAMBER LIAISON</p>
                           <div className="space-y-1">
                             <p className="text-sm text-slate-600 font-light">+91 11 2345 6789</p>
                             <p className="text-sm text-slate-600 font-light underline underline-offset-4 decoration-slate-100 hover:decoration-[#CC1414] transition-all cursor-pointer">delhi.office@akpandey.com</p>
                           </div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightDetail;
