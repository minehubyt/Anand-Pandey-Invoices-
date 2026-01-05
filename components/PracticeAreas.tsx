
import React from 'react';
import { PRACTICE_AREAS, getIcon } from '../constants';

interface PracticeAreasProps {
  onNavigate?: (type: 'practice', id: string) => void;
}

const PracticeAreas: React.FC<PracticeAreasProps> = ({ onNavigate }) => {
  const mapAreaToSlug = (id: string) => {
    switch(id) {
      case 'corp': return 'corp-law';
      case 'crim': return 'crim-defense';
      case 'civ': return 'civil-litigation';
      case 'ip': return 'ip-law';
      case 'fam': return 'family-law';
      case 'est': return 'estate-planning';
      default: return 'corp-law';
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#CC1414] mb-4 flex items-center">
              <span className="w-10 h-px bg-[#CC1414] mr-3"></span>
              PRACTICE SCOPE
            </h2>
            <h3 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-serif text-slate-900 leading-[1.1] font-medium">
              A Multidisciplinary Framework for Global Mandates
            </h3>
          </div>
          <p className="max-w-md text-slate-500 font-light text-[clamp(14px,0.9vw,16px)] leading-relaxed opacity-80">
            Strategic legal architecture tailored to the complexities of international trade, constitutional challenges, and private assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-slate-100">
          {PRACTICE_AREAS.map((area) => (
            <div
              key={area.id}
              onClick={() => onNavigate?.('practice', mapAreaToSlug(area.id))}
              className={`p-10 border-r border-b border-slate-100 hover:bg-slate-50 transition-all duration-700 group cursor-pointer relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-[#CC1414] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              
              <div className="text-slate-900 mb-6 transform group-hover:scale-110 group-hover:text-[#CC1414] transition-all duration-700">
                {getIcon(area.icon)}
              </div>
              <h4 className="text-lg font-serif text-slate-900 mb-3 group-hover:text-[#CC1414] transition-colors duration-500">
                {area.title}
              </h4>
              <p className="text-slate-500 font-light leading-relaxed text-sm mb-5 opacity-90">
                {area.description}
              </p>
              
              <div className="flex items-center gap-2.5 text-[9px] font-bold tracking-[0.3em] uppercase text-slate-300 group-hover:text-slate-900 transition-colors duration-500">
                <span>VIEW SPECIALIZATION</span>
                <div className="w-5 h-px bg-slate-200 group-hover:w-8 group-hover:bg-[#CC1414] transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;
