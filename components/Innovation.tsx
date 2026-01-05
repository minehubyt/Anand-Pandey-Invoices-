
import React from 'react';

const Innovation: React.FC = () => {
  return (
    <section id="achievements" className="py-24 bg-slate-50 flex justify-center items-center">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white p-12 lg:p-20 shadow-sm text-center relative border border-slate-100">
          <blockquote className="text-2xl lg:text-4xl font-serif italic text-slate-800 leading-snug mb-8">
            “AK Pandey’s ability both to spot market opportunities for expanding legal practices and to deploy AI and proprietary data exemplifies how a legal office can establish a position in the new AI economy.”
          </blockquote>
          <p className="text-xl lg:text-2xl font-serif text-slate-900 mb-2">
            Most Innovative Legal Counsel in South Asia 2025
          </p>
          <p className="text-[11px] font-bold tracking-[0.4em] text-[#CC1414] uppercase">
            THE TAX JOURNAL
          </p>
          
          <div className="flex justify-center space-x-2 mt-12">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-slate-200"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Innovation;
