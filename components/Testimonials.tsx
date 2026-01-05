
import React from 'react';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Advocate Pandey's strategic intervention in our cross-border tax dispute was nothing short of brilliant. His team navigates complex regulatory frameworks with clinical precision.",
    author: "Aditya Vardhan",
    title: "Chief Counsel, Global Tech Corp",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "The level of discretion and high-stakes strategy provided by AK Pandey & Associates is unparalleled in the region. They are our first choice for constitutional matters.",
    author: "Sarah Mendonsa",
    title: "Managing Partner, Sterling Investment Group",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "Precision, integrity, and deep sector expertise. They don't just provide legal advice; they provide a roadmap for institutional stability.",
    author: "Vikram Malhotra",
    title: "Director, Infrastructure Development Board",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-20 xl:px-32">
        <div className="mb-20 animate-reveal-up">
          <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#CC1414] mb-6">CLIENT VOICES</h2>
          <h3 className="text-4xl lg:text-5xl font-serif text-slate-900">Mandate Outcomes & Testimonials</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="flex flex-col animate-reveal-up" style={{ animationDelay: `${idx * 200}ms` }}>
              <div className="mb-8 text-[#CC1414]/20">
                <Quote size={48} fill="currentColor" />
              </div>
              <p className="text-xl text-slate-600 font-light italic leading-relaxed mb-10 flex-grow">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-5 pt-8 border-t border-slate-50">
                <div className="w-14 h-14 rounded-full overflow-hidden grayscale">
                  <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900 tracking-tight">{t.author}</p>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
