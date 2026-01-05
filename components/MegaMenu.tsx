import React, { useEffect, useState } from 'react';

interface MegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
  onNavigate: (type: string, id?: string) => void;
}

export const MENU_DATA: Record<string, {
  sections: { title: string; links: { name: string; type: 'home' | 'insight' | 'page' | 'rfp' | 'thinking' | 'practice' | 'careers' | 'booking'; id: string; href?: string }[] }[];
  featured?: { title: string; desc: string; image: string; type: 'home' | 'insight' | 'page' | 'rfp' | 'thinking' | 'practice' | 'careers' | 'booking'; id: string };
}> = {
  'Who we Are': {
    sections: [
      {
        title: 'OUR FIRM',
        links: [
          { name: 'Firm Profile', type: 'page', id: 'firm-profile' },
          { name: 'Leadership', type: 'page', id: 'leadership' },
          { name: 'History', type: 'page', id: 'history' },
          { name: 'Values & Culture', type: 'page', id: 'values' },
        ]
      }
    ],
    featured: {
      title: 'Decades of Excellence',
      desc: 'Learn about our journey from a small chamber to a leading legal powerhouse in South Asia.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      type: 'page',
      id: 'history'
    }
  },
  'What we Do': {
    sections: [
      {
        title: 'PRACTICES',
        links: [
          { name: 'Corporate Law', type: 'practice', id: 'corp-law' },
          { name: 'Criminal Defense', type: 'practice', id: 'crim-defense' },
          { name: 'Civil Litigation', type: 'practice', id: 'civil-litigation' },
          { name: 'Intellectual Property', type: 'practice', id: 'ip-law' },
          { name: 'Family Law', type: 'practice', id: 'family-law' },
        ]
      },
      {
        title: 'INDUSTRIES',
        links: [
          { name: 'Technology', type: 'page', id: 'industry-tech' },
          { name: 'Financial Institutions', type: 'page', id: 'industry-finance' },
          { name: 'Energy & Infrastructure', type: 'page', id: 'industry-energy' },
          { name: 'Healthcare', type: 'page', id: 'industry-healthcare' },
        ]
      }
    ],
    featured: {
      title: 'Complex Mandates',
      desc: 'We navigate the most challenging legal landscapes with strategic foresight and precision.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
      type: 'practice',
      id: 'corp-law'
    }
  },
  'Our Thinking': {
    sections: [
      {
        title: 'EXPLORE',
        links: [
          { name: 'Latest Insights', type: 'thinking', id: 'insights' },
          { name: 'Annual Reports', type: 'thinking', id: 'reports' },
          { name: 'Legal Briefings Podcast', type: 'thinking', id: 'podcasts' },
          { name: 'Thought Articles', type: 'thinking', id: 'articles' },
        ]
      },
      {
        title: 'RESOURCES',
        links: [
          { name: 'Year in Review', type: 'page', id: 'year-in-review' },
          { name: 'Practice Guides', type: 'page', id: 'guides' },
          { name: 'Webcasts', type: 'page', id: 'events' },
        ]
      }
    ],
    featured: {
      title: '2025 Judiciary Review',
      desc: 'Our latest analysis on the shifting priorities of high-stakes litigation in India.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
      type: 'thinking',
      id: 'year-in-review'
    }
  },
  'Career': {
    sections: [
      {
        title: 'OPPORTUNITIES',
        links: [
          { name: 'Law Students', type: 'careers', id: 'careers-students' },
          { name: 'Experienced Lawyers', type: 'careers', id: 'careers-exp' },
          { name: 'Staff Roles', type: 'careers', id: 'careers-staff' },
        ]
      },
      {
        title: 'LIFE AT THE FIRM',
        links: [
          { name: 'Culture & Mentorship', type: 'careers', id: 'culture' },
          { name: 'Professional Development', type: 'careers', id: 'development' },
        ]
      }
    ],
    featured: {
      title: 'Join Our Legacy',
      desc: 'We are always looking for driven, exceptional legal talent to join our chambers.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
      type: 'careers',
      id: 'careers-exp'
    }
  },
  'Offices': {
    sections: [
      {
        title: 'DOMESTIC',
        links: [
          { name: 'Ranchi (Headquarters)', type: 'practice', id: 'locations', href: '#locations' },
        ]
      },
      {
        title: 'GLOBAL REACH',
        links: [
          { name: 'London (Associate Office)', type: 'page', id: 'office-london' },
          { name: 'Dubai (Associate Office)', type: 'page', id: 'office-dubai' },
        ]
      }
    ],
    featured: {
      title: 'Strategic Presence',
      desc: 'Located in key judicial and commercial capitals to serve clients better.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      type: 'practice',
      id: 'locations'
    }
  },
  'Connect': {
    sections: [
      {
        title: 'GET IN TOUCH',
        links: [
          { name: 'Book Consultation', type: 'booking', id: 'booking' },
          { name: 'Submit RFP', type: 'rfp', id: 'rfp' },
          { name: 'Media Inquiries', type: 'page', id: 'media' },
        ]
      },
      {
        title: 'CLIENT PORTAL',
        links: [
           { name: 'Client Login', type: 'booking', id: 'login' },
        ]
      }
    ],
    featured: {
        title: 'Secure Intake',
        desc: 'Our encrypted matrix ensures your legal matters are handled with absolute confidentiality.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
        type: 'booking',
        id: 'booking'
    }
  }
};

const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, onClose, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const data = activeMenu ? MENU_DATA[activeMenu] : null;

  useEffect(() => {
    if (activeMenu) {
        setIsVisible(true);
    } else {
        const timer = setTimeout(() => setIsVisible(false), 300);
        return () => clearTimeout(timer);
    }
  }, [activeMenu]);

  if (!activeMenu && !isVisible) return null;

  return (
    <div 
      className={`fixed top-16 left-0 w-full bg-white border-b border-slate-200 shadow-2xl z-40 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top ${activeMenu ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}
      onMouseLeave={onClose}
    >
      <div className="max-w-[1920px] mx-auto px-12 lg:px-20 py-16">
        <div className="grid grid-cols-12 gap-16">
          
          {/* Menu Sections */}
          <div className="col-span-8 grid grid-cols-3 gap-12 border-r border-slate-100 pr-12">
            {data?.sections.map((section, idx) => (
              <div key={idx} className="space-y-8">
                <h4 className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#CC1414] mb-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-[#CC1414]"></div>
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a 
                        href={link.href || '#'} 
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(link.type, link.id);
                          onClose();
                        }}
                        className="text-[17px] font-serif text-slate-600 hover:text-[#CC1414] transition-colors block py-1 group flex items-center gap-2"
                      >
                         <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 text-[#CC1414]">→</span>
                         {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured Content */}
          <div className="col-span-4 pl-4">
            {data?.featured && (
              <div 
                 className="relative group cursor-pointer overflow-hidden aspect-[4/3] bg-slate-100 shadow-lg"
                 onClick={() => {
                    onNavigate(data.featured!.type, data.featured!.id);
                    onClose();
                 }}
              >
                <img 
                   src={data.featured.image} 
                   alt={data.featured.title} 
                   className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                   <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3 text-white/80">FEATURED</p>
                   <h3 className="text-2xl font-serif mb-4 leading-tight">{data.featured.title}</h3>
                   <p className="text-sm font-light text-white/80 leading-relaxed mb-6">{data.featured.desc}</p>
                   <span className="text-[10px] font-bold uppercase tracking-widest border-b border-white pb-1 group-hover:text-[#CC1414] group-hover:border-[#CC1414] transition-colors">Explore Now</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MegaMenu;