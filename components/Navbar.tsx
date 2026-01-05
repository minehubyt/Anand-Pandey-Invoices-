
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Globe, User, Plus, Minus } from 'lucide-react';
import MegaMenu, { MENU_DATA } from './MegaMenu';

interface NavbarProps {
  onNavigate: (type: 'home' | 'insight' | 'page' | 'rfp' | 'thinking' | 'practice' | 'careers' | 'login' | 'booking', id?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'What we Do', href: '#services', type: 'home' },
    { name: 'Who we Are', href: '#about', type: 'home' },
    { name: 'Our Thinking', href: '#insights', type: 'thinking' },
    { name: 'Career', href: '#careers', type: 'careers' },
    { name: 'Offices', href: '#locations', type: 'home' },
    { name: 'Connect', href: '#booking', type: 'booking' }
  ];

  const handleNavClick = (link: any) => {
    setIsOpen(false);
    setActiveMenu(null);
    setMobileExpanded(null);
    
    if (link.type === 'thinking') {
      onNavigate('thinking');
    } else if (link.type === 'careers') {
      onNavigate('careers');
    } else if (link.type === 'booking') {
      onNavigate('booking');
    } else if (link.type === 'practice') {
      onNavigate('practice', link.id);
    } else if (link.type === 'page') {
      onNavigate('page', link.id);
    } else if (link.type === 'insight') {
      onNavigate('insight', link.id);
    } else {
      onNavigate('home');
      if (link.href && link.href.startsWith('#')) {
        setTimeout(() => {
          const target = document.querySelector(link.href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const toggleMenu = (name: string, link: any) => {
    if (activeMenu === name) {
      setActiveMenu(null);
    } else {
      const hasSubMenu = ['What we Do', 'Who we Are', 'Our Thinking', 'Offices', 'Connect'].includes(name);
      if (hasSubMenu) {
        setActiveMenu(name);
      } else {
        handleNavClick(link);
      }
    }
  };

  const toggleMobileSubMenu = (name: string) => {
    setMobileExpanded(mobileExpanded === name ? null : name);
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white border-b border-slate-200 h-16`}
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Logo Section */}
          <div className="flex items-center min-w-0 flex-shrink-0 h-full">
            <button 
              className="mr-4 p-1 text-slate-900 focus:outline-none transition-colors group" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 transition-transform" />}
            </button>
            
            <button onClick={() => onNavigate('home')} className="flex items-center overflow-hidden group h-full">
              <div className="flex items-center font-sans uppercase tracking-[0.18em] text-[#A6192E] font-medium transition-all duration-500 origin-left">
                <span className="text-[16px] lg:text-[18px] leading-none font-medium">AK PANDEY</span>
                <span className="text-[11px] mx-1.5 self-center">&</span>
                <span className="text-[16px] lg:text-[18px] leading-none font-medium">ASSOCIATES</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center h-full ml-auto">
            <div className="flex items-center h-full gap-8">
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative h-full flex items-center group"
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(link.name, link);
                    }}
                    className={`font-bold tracking-[0.12em] uppercase transition-all whitespace-nowrap border-b-2 py-1 text-[11px]
                      ${activeMenu === link.name ? 'text-[#CC1414] border-[#CC1414]' : 'text-slate-800 border-transparent hover:text-[#CC1414]'}
                    `}
                  >
                    {link.name}
                  </a>
                </div>
              ))}
            </div>
            
            {/* Right Icons Section */}
            <div className="flex items-center border-l border-slate-200 ml-6 pl-6 h-6 gap-4 self-center">
              <button className="text-slate-800 hover:text-[#CC1414] transition-colors p-1" aria-label="Search">
                <Search className="w-4 h-4 stroke-[2]" />
              </button>
              
              <div className="flex items-center gap-1.5 text-slate-800 hover:text-[#CC1414] transition-colors cursor-pointer group select-none px-1">
                <Globe className="w-4 h-4 stroke-[2]" />
                <span className="font-bold tracking-wider uppercase text-[10px]">EN</span>
              </div>
              
              <button 
                className="text-slate-800 hover:text-[#CC1414] transition-colors p-1" 
                aria-label="Login"
                onClick={() => onNavigate('login')}
              >
                <User className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Mobile Right Icons (Only visible when desktop nav is hidden) */}
          <div className="lg:hidden flex items-center space-x-3">
             <button className="p-2 text-slate-900" aria-label="Search">
                <Search className="w-5 h-5" />
             </button>
             <button 
              className="p-2 text-slate-900" 
              aria-label="Login"
              onClick={() => onNavigate('login')}
             >
                <User className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      <MegaMenu 
        activeMenu={activeMenu} 
        onClose={() => setActiveMenu(null)} 
        onNavigate={onNavigate as any} 
      />

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer - Increased z-index to cover navbar */}
      <div className={`fixed top-0 left-0 h-full bg-white z-[60] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl w-[85%] sm:w-[400px] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col px-8 py-12 overflow-y-auto custom-scrollbar">
          <button 
            className="absolute top-6 right-6 p-2 text-slate-400 transition-colors hover:text-[#CC1414]"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-12">
             <div className="flex items-center font-sans uppercase tracking-[0.18em] text-[#A6192E] font-medium mb-12">
                <span className="text-[18px] leading-none font-medium">AK PANDEY</span>
                <span className="text-[11px] mx-1.5 self-center">&</span>
                <span className="text-[18px] leading-none font-medium">ASSOCIATES</span>
             </div>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link, idx) => {
              const hasSubMenu = !!MENU_DATA[link.name];
              const isExpanded = mobileExpanded === link.name;
              
              return (
                <div key={link.name} className="flex flex-col border-b border-slate-50 last:border-0">
                  <div className="flex items-center justify-between py-4">
                    <a
                      href={link.href}
                      className={`text-xl font-serif font-medium text-slate-900 group flex justify-between items-center transition-colors duration-300 hover:text-[#CC1414] ${isExpanded ? 'text-[#CC1414]' : ''}`}
                      onClick={(e) => {
                        if (hasSubMenu) {
                          e.preventDefault();
                          toggleMobileSubMenu(link.name);
                        } else {
                          e.preventDefault();
                          handleNavClick(link);
                        }
                      }}
                    >
                      {link.name}
                    </a>
                    {hasSubMenu && (
                      <button 
                        onClick={() => toggleMobileSubMenu(link.name)}
                        className={`p-2 transition-colors ${isExpanded ? 'text-[#CC1414]' : 'text-slate-400 hover:text-[#CC1414]'}`}
                      >
                         {isExpanded ? <Minus size={20} /> : <Plus size={20} />}
                      </button>
                    )}
                  </div>
                  
                  {/* Mobile Submenu */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                    {hasSubMenu && MENU_DATA[link.name].sections.map((section, sIdx) => (
                       <div key={sIdx} className="pl-4 mb-6">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{section.title}</p>
                          <div className="flex flex-col space-y-3 border-l border-slate-100 pl-4">
                             {section.links.map((subLink, lIdx) => (
                                <button
                                   key={lIdx}
                                   onClick={() => handleNavClick(subLink)}
                                   className="text-left text-sm font-light text-slate-600 hover:text-[#CC1414] transition-colors"
                                >
                                   {subLink.name}
                                </button>
                             ))}
                          </div>
                       </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
