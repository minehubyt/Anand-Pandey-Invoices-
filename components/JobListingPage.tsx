
import React, { useState, useEffect } from 'react';
import { Menu, Search, Briefcase, MapPin, Calendar, ArrowRight, Filter, RefreshCw } from 'lucide-react';
import { contentService } from '../services/contentService';
import { Job } from '../types';

interface JobListingPageProps {
  onBack: () => void;
  onApply: (job: Job) => void;
}

const JobListingPage: React.FC<JobListingPageProps> = ({ onBack, onApply }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const unsub = contentService.subscribeJobs((data) => {
      setJobs(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredJobs = filter === 'All' ? jobs : jobs.filter(j => j.department === filter);

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Standardized Sleek Header */}
      <header className="fixed top-0 w-full z-[60] bg-white border-b border-slate-100 h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-900 hover:text-[#CC1414] transition-colors">
             <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center font-sans uppercase tracking-[0.15em] text-slate-900 font-bold text-[13px] md:text-[15px]">
             AK PANDEY CAREERS
          </div>
        </div>
        <div className="flex items-baseline font-sans uppercase tracking-[0.08em] text-slate-900 font-bold text-[11px] md:text-[13px] hidden sm:flex">
           AK PANDEY <span className="text-[9px] md:text-[10px] mx-1">&</span> ASSOCIATES
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20">
        <div className="mb-20">
          <h1 className="text-6xl md:text-8xl font-serif text-slate-900 mb-8 leading-none">Open Positions</h1>
          <div className="h-1.5 w-32 bg-[#CC1414] mb-12"></div>
          <p className="text-xl text-slate-500 font-light max-w-2xl leading-relaxed">
            Joining AK Pandey & Associates means becoming part of an elite multidisciplinary legal framework. We seek specialists who thrive in high-stakes environments.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-64 shrink-0 space-y-8">
             <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department</label>
                <div className="flex flex-col gap-2">
                   {['All', 'Litigation', 'Corporate', 'Support', 'Internship'].map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setFilter(cat)}
                        className={`text-left px-4 py-2 text-sm font-medium transition-colors rounded-sm ${filter === cat ? 'bg-[#CC1414] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {cat}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="flex-1 space-y-6">
            {loading ? (
              <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-slate-300" /></div>
            ) : filteredJobs.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 text-slate-400 font-serif italic text-2xl">
                No active mandates in this category. Check back soon.
              </div>
            ) : (
              filteredJobs.map(job => (
                <div key={job.id} className="p-10 border border-slate-100 bg-white hover:shadow-2xl hover:-translate-y-1 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500">{job.department}</span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <MapPin size={14}/> {job.location}
                        </div>
                      </div>
                      <h3 className="text-3xl font-serif text-slate-900 group-hover:text-[#CC1414] transition-colors mb-4">{job.title}</h3>
                      <p className="text-slate-500 font-light line-clamp-2 max-w-3xl leading-relaxed">{job.description}</p>
                    </div>
                    <button 
                      onClick={() => onApply(job)}
                      className="px-10 py-5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#CC1414] transition-all shrink-0 shadow-xl"
                    >
                      APPLY NOW
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingPage;
