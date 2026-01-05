
import React from 'react';
import { ChevronRight, Users, Globe, Award, Menu } from 'lucide-react';

interface CareersPageProps {
  onBack: () => void;
  onNavigate: (type: any, id?: string) => void;
}

const CareersPage: React.FC<CareersPageProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="animate-page-fade bg-white min-h-screen font-sans">
      
      {/* Precision Navigation Header */}
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
           <span>AK PANDEY <span className="text-[9px] md:text-[10px] mx-1">&</span> ASSOCIATES</span>
        </div>
      </header>

      {/* High-Impact Hero Section */}
      <div className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col pt-16 bg-slate-50">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2400" 
            className="w-full h-full object-cover grayscale brightness-[0.9] opacity-20" 
            alt="Office Ambient" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/20" />
        </div>
        
        {/* Central Portrait Image */}
        <div className="absolute inset-0 z-10 flex items-center justify-center lg:justify-end lg:pr-32">
          <div className="relative w-full max-w-2xl h-[80%] animate-scale-out overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200"
               className="w-full h-full object-cover object-top filter brightness-[1.05]"
               alt="Excellence in Leadership"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-20 flex-1 flex items-end pb-72 md:pb-80 lg:pb-96 px-6 md:px-12 lg:px-12 xl:px-12">
          <div className="w-full animate-reveal-up stagger-2">
            <h1 className="text-[clamp(2.5rem,9vw,9rem)] font-sans font-bold text-white leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">
              WHERE AMBITION<br />MEETS EXCELLENCE
            </h1>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="absolute bottom-0 left-0 w-full z-30 grid grid-cols-1 md:grid-cols-3 h-auto md:h-56">
          <HeroNavigationCard 
            title="Beginning Your Legal Career" 
            image="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200"
            onClick={() => onNavigate('jobs')}
          />
          <HeroNavigationCard 
            title="Experienced Lawyers & Judicial Clerks" 
            image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1200"
            onClick={() => onNavigate('jobs')}
          />
          <HeroNavigationCard 
            title="Professional Staff & Paralegals" 
            image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
            onClick={() => onNavigate('jobs')}
          />
        </div>
      </div>

      {/* Value Proposition Section */}
      <section className="py-24 md:py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-12 xl:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:items-end mb-20">
            <div className="max-w-3xl">
              <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-serif text-slate-900 mb-8 leading-tight">We recognise your value</h2>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                Creating an inclusive environment with equal opportunities for you to grow with us. Our HR philosophy encompasses an inclusive approach to become an industry leading employer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EVPCard 
              icon={<Globe className="w-8 h-8 text-blue-600" />}
              title="Support Nation Building"
              points={[
                "Global footprint with domestic focus",
                "Building regulatory self-reliance",
                "Mandates of national significance"
              ]}
            />
            <EVPCard 
              icon={<Users className="w-8 h-8 text-indigo-600" />}
              title="Leadership From Within"
              points={[
                "Accelerated partnership paths",
                "Direct mentorship with Partners",
                "Empowered decision making"
              ]}
            />
            <EVPCard 
              icon={<Award className="w-8 h-8 text-yellow-600" />}
              title="Elite Rewards"
              points={[
                "Market-leading compensation",
                "Performance-driven bonuses",
                "Global secondment opportunities"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Diversity Section */}
      <section className="py-24 md:py-32 bg-white border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-12 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
             <div>
                <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-serif text-slate-900 mb-10 leading-tight">Creating opportunities to encourage gender diversity in the workplace</h2>
                <p className="text-lg text-slate-500 font-light leading-relaxed mb-10">
                  AK Pandey & Associates provides equal opportunities for all its employees. We aim to achieve 50% gender diversity in Enabling Functions and 20% in Senior Litigation roles by 2030.
                </p>
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-[#CC1414] rounded-full" />
                      <p className="text-slate-700 font-medium">UN Women's Empowerment Principles Signatory</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-[#CC1414] rounded-full" />
                      <p className="text-slate-700 font-medium">Top Rated Workplace for Diversity 2025</p>
                   </div>
                </div>
             </div>
             <div className="aspect-video bg-slate-100 overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600" 
                  className="w-full h-full object-cover"
                  alt="Inclusive Environment"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Careers Footer Call to Action */}
      <section className="py-24 bg-[#0A1931] text-white">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-serif mb-12 italic">Join the Elite.</h2>
            <button 
               onClick={() => onNavigate('jobs')}
               className="px-16 py-6 bg-white text-slate-900 text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-[#CC1414] hover:text-white transition-all shadow-2xl"
            >
               OPEN POSITIONS
            </button>
         </div>
      </section>
    </div>
  );
};

const HeroNavigationCard: React.FC<{ title: string, image: string, onClick: () => void }> = ({ title, image, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative overflow-hidden cursor-pointer border-r border-white/5 last:border-r-0 h-48 md:h-full"
  >
    <div className="absolute inset-0 z-0">
      <img 
        src={image} 
        className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[2s]" 
        alt={title} 
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-700" />
    </div>
    <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-tight uppercase tracking-tight pr-8">
          {title}
        </h3>
        <ChevronRight className="w-8 h-8 text-white transform group-hover:translate-x-2 transition-transform duration-500 shrink-0" />
      </div>
    </div>
  </div>
);

const EVPCard: React.FC<{ icon: any, title: string, points: string[] }> = ({ icon, title, points }) => (
  <div className="p-12 bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group hover:-translate-y-2 rounded-sm">
    <div className="mb-10 transform group-hover:scale-110 transition-transform duration-700 origin-left opacity-80">{icon}</div>
    <h3 className="text-2xl font-serif text-slate-900 mb-10 border-b border-slate-50 pb-6 group-hover:text-[#CC1414] transition-colors">{title}</h3>
    <ul className="space-y-6">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-4 text-[16px] text-slate-500 font-light leading-relaxed">
           <div className="w-1.5 h-1.5 bg-slate-200 mt-2.5 shrink-0 group-hover:bg-[#CC1414] transition-colors" />
           {p}
        </li>
      ))}
    </ul>
  </div>
);

export default CareersPage;
