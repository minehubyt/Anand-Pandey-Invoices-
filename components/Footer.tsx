
import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (type: any, id?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center font-sans uppercase tracking-[0.18em] text-white font-medium mb-8">
              <span className="text-[20px] lg:text-[26px] leading-none">AK PANDEY</span>
              <span className="text-[13px] lg:text-[16px] mx-1.5 self-center">&</span>
              <span className="text-[20px] lg:text-[26px] leading-none">ASSOCIATES</span>
            </div>
            <p className="max-w-md text-sm leading-relaxed mb-8 text-slate-500 font-light">
              Dedicated to delivering justice and expert legal counsel for over two decades. Representing clients in high courts and the Supreme Court of India with uncompromising integrity.
            </p>
            <div className="flex space-x-6">
              <button className="hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></button>
              <button className="hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></button>
              <button className="hover:text-white transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></button>
              <button className="hover:text-white transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></button>
            </div>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Explore</h5>
            <ul className="space-y-4 text-sm font-light">
              <li><button onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'}), 100); }} className="hover:text-white transition-colors">Our Practices</button></li>
              <li><button onClick={() => onNavigate('page', 'leadership')} className="hover:text-white transition-colors">About AK Pandey</button></li>
              <li><button onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('locations')?.scrollIntoView({behavior:'smooth'}), 100); }} className="hover:text-white transition-colors">Locations</button></li>
              <li><button onClick={() => { onNavigate('booking'); }} className="hover:text-white transition-colors">Book Consultation</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Internal</h5>
            <ul className="space-y-4 text-sm font-light">
              <li><button onClick={() => onNavigate('login')} className="flex items-center gap-2 hover:text-[#CC1414] transition-colors"><Lock className="w-3 h-3" /> Strategic Portal</button></li>
              <li><button onClick={() => onNavigate('page', 'privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('page', 'disclaimer')} className="hover:text-white transition-colors">Disclaimer</button></li>
              <li><button onClick={() => onNavigate('page', 'terms')} className="hover:text-white transition-colors">Terms of Use</button></li>
              <li><button onClick={() => onNavigate('page', 'compliance')} className="hover:text-white transition-colors">Compliance</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs tracking-widest uppercase">
            &copy; {new Date().getFullYear()} AK Pandey & Associates. All Rights Reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[#CC1414] transition-colors"
          >
            Back to Top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
