
import React from 'react';
import { ArrowLeft, ArrowRight, Shield, Briefcase, Gavel, Scale, FileText, Users, Download, Info, Zap, AlertTriangle, HelpCircle, Lock } from 'lucide-react';

interface PracticeAreaPageProps {
  id: string;
  onBack: () => void;
  onNavigate: (type: 'home' | 'insight' | 'page' | 'rfp' | 'thinking' | 'practice', id?: string) => void;
}

const CONTENT_MAP: Record<string, any> = {
  'corp-law': {
    title: 'Corporate Law',
    heroHeadline: 'Decisions That Shape Enterprises',
    heroSubtext: 'M&A, restructuring, corporate governance, and regulatory strategy.',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2400',
    philosophy: {
      title: 'Corporate Advisory Philosophy',
      points: [
        { label: 'Long-term value over short-term wins', desc: 'Focusing on sustainable corporate growth.' },
        { label: 'Risk-weighted decision-making', desc: 'Analyzing regulatory and commercial risks.' },
        { label: 'Institutional Alignment', desc: 'Aligning with promoters, boards, and global investors.' }
      ]
    },
    coverage: [
      'Mergers & Acquisitions',
      'Private Equity & Venture Capital',
      'Corporate Governance & Board Advisory',
      'Regulatory & Compliance',
      'Due Diligence & Transaction Structuring'
    ],
    mandates: [
      '₹XXX Cr acquisition in manufacturing sector',
      'Cross-border JV structuring for telecom giant',
      'Governance overhaul for major NSE listed entity'
    ],
    sidebarType: 'corporate'
  },
  'crim-defense': {
    title: 'Criminal Defense',
    heroHeadline: 'When Liberty Is at Stake',
    heroSubtext: 'Strategic criminal defense in complex and high-risk matters.',
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400',
    philosophy: {
      title: 'Defense Strategy Framework',
      points: [
        { label: 'Early-stage intervention', desc: 'Mitigating risks before the investigative stage peaks.' },
        { label: 'Evidence dismantling', desc: 'Rigorous analysis of procedural and factual lapses.' },
        { label: 'Media & Reputation', desc: 'Proactive management of public perception.' }
      ]
    },
    coverage: [
      'White-Collar Crimes',
      'Economic Offences',
      'Trial & Appellate Defense',
      'Bail & Anticipatory Bail',
      'Enforcement Directorate / CBI Matters'
    ],
    mandates: [
      'Successful quashing of FIR in corporate fraud case',
      'Bail secured for HNI in multi-state economic dispute',
      'Complete discharge in high-profile PMLA investigation'
    ],
    sidebarType: 'criminal'
  },
  'civil-litigation': {
    title: 'Civil Litigation',
    heroHeadline: 'Disputes Resolved. Rights Enforced.',
    heroSubtext: 'Commercial and private civil litigation across forums.',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2400',
    philosophy: {
      title: 'Litigation Philosophy',
      points: [
        { label: 'Strategy before aggression', desc: 'Every move calculated for long-term legal gain.' },
        { label: 'Settlement where sensible', desc: 'Commercial resolution preferred over vanity wins.' },
        { label: 'Litigation as tool', desc: 'When inevitable, we execute with precision.' }
      ]
    },
    coverage: [
      'Commercial Suits',
      'Contractual Disputes',
      'Property & Real Estate',
      'Arbitration & ADR',
      'Injunctions & Recovery'
    ],
    mandates: [
      'Successful resolution of complex shareholder dispute',
      'Recovery of assets in cross-border property litigation',
      'Injunction secured for tech firm against IP breach'
    ],
    sidebarType: 'civil'
  },
  'ip-law': {
    title: 'Intellectual Property',
    heroHeadline: 'Protect What You Create',
    heroSubtext: 'End-to-end IP protection and enforcement.',
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2400',
    philosophy: {
      title: 'IP Strategy Advisory',
      points: [
        { label: 'IP as business asset', desc: 'Maximizing commercial value of intangible rights.' },
        { label: 'Monetisation', desc: 'Strategic licensing and royalty frameworks.' },
        { label: 'Global Enforcement', desc: 'Defending assets across international borders.' }
      ]
    },
    coverage: [
      'Trademarks & Copyrights',
      'Patents & Design Protection',
      'IP Litigation & Enforcement',
      'Media & Entertainment Law',
      'Tech-Pharma IP Audits'
    ],
    mandates: [
      'Global trademark portfolio management for retail brand',
      'Patent litigation win for renewable energy firm',
      'Copyright enforcement for leading media production house'
    ],
    sidebarType: 'ip'
  },
  'family-law': {
    title: 'Family Law',
    heroHeadline: 'Guidance Through Life’s Most Personal Matters',
    heroSubtext: 'Sensitive, strategic family law counsel.',
    heroImage: 'https://images.unsplash.com/photo-1524492459413-5bc37ec4e271?auto=format&fit=crop&q=80&w=2400',
    philosophy: {
      title: 'Approach to Family Law',
      points: [
        { label: 'Dignity & Respect', desc: 'Maintaining familial integrity during disputes.' },
        { label: 'Child-Centric Focus', desc: 'Prioritizing long-term stability for minors.' },
        { label: 'Mediation First', desc: 'Preferred route for amicable settlements.' }
      ]
    },
    coverage: [
      'Divorce & Separation',
      'Child Custody & Guardianship',
      'Maintenance & Alimony',
      'Domestic Violence Advocacy',
      'Estate & Succession Planning'
    ],
    mandates: [
      'Complex cross-border custody settlement',
      'High-value alimony and property division',
      'Amicable mediation for heritage estate division'
    ],
    sidebarType: 'family'
  }
};

const Sidebar: React.FC<{ type: string; onNavigate: any }> = ({ type, onNavigate }) => {
  switch (type) {
    case 'corporate':
      return (
        <div className="space-y-10 animate-fade-in delay-500">
          <div className="bg-[#0A1931] text-white p-10 md:p-12 shadow-2xl">
             <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-300 mb-8 border-b border-white/10 pb-4">ENGAGEMENT</h4>
             <p className="text-2xl font-serif mb-8 leading-tight">Request for Proposal</p>
             <button onClick={() => onNavigate('rfp')} className="w-full py-5 bg-[#CC1414] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl">
                SUBMIT RFP <ArrowRight className="w-4 h-4" />
             </button>
          </div>
          <div className="p-10 border border-slate-100 bg-white">
             <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-8">RESOURCES</h4>
             <ul className="space-y-6">
               <li><button className="flex items-center gap-3 text-[15px] text-slate-600 hover:text-[#CC1414] transition-colors"><Download className="w-4 h-4" /> Capability Statement</button></li>
               <li><button className="flex items-center gap-3 text-[15px] text-slate-600 hover:text-[#CC1414] transition-colors"><Info className="w-4 h-4" /> M&A Checklist 2025</button></li>
             </ul>
          </div>
        </div>
      );
    case 'criminal':
      return (
        <div className="space-y-10 animate-fade-in delay-500">
          <div className="bg-red-950 text-white p-10 md:p-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
             <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-red-200 mb-8 flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" /> EMERGENCY CONTACT
             </h4>
             <p className="text-2xl font-serif mb-2 leading-tight">24/7 Counsel</p>
             <p className="text-3xl md:text-4xl font-bold mb-8">+91 99999 00000</p>
             <p className="text-xs text-red-100/60 font-light leading-relaxed mb-8">Immediate support for bail, search & seizure, and arrest scenarios.</p>
             <button className="w-full py-4 bg-white text-red-950 text-[11px] font-bold tracking-widest uppercase hover:bg-red-200 transition-all">
                SECURE CALL
             </button>
          </div>
          <div className="p-10 border-2 border-[#CC1414]/10 bg-white shadow-lg">
             <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-8">SECURE INTAKE</h4>
             <button className="w-full py-5 bg-slate-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-[#CC1414] transition-all flex items-center justify-center gap-3 shadow-xl">
                INITIATE CASE <Lock className="w-4 h-4" />
             </button>
          </div>
        </div>
      );
    case 'civil':
      return (
        <div className="space-y-10 animate-fade-in delay-500">
          <div className="bg-slate-50 p-10 md:p-12 border border-slate-200 shadow-sm">
             <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-8">DISPUTE ASSESSMENT</h4>
             <p className="text-2xl font-serif text-slate-900 mb-6 leading-tight">Evaluate Your Case</p>
             <p className="text-[15px] text-slate-500 font-light mb-10 leading-relaxed">Receive a preliminary strategic overview based on your dispute parameters.</p>
             <button className="w-full py-5 border-2 border-slate-900 text-slate-900 text-[11px] font-bold tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-all shadow-md">
                START EVALUATION
             </button>
          </div>
          <div className="p-10 bg-white border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-14 h-14 bg-blue-50 flex items-center justify-center shrink-0 rounded-full">
                <HelpCircle className="w-7 h-7 text-blue-600" />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">JURISDICTION FINDER</p>
                <p className="text-[16px] text-slate-900 font-medium underline underline-offset-4 decoration-blue-100 hover:decoration-blue-600 cursor-pointer transition-all">Check Court Eligibility</p>
             </div>
          </div>
        </div>
      );
    case 'ip':
      return (
        <div className="space-y-10 animate-fade-in delay-500">
          <div className="bg-slate-900 text-white p-10 md:p-12 shadow-2xl">
             <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-indigo-300 mb-8">INNOVATION DESK</h4>
             <p className="text-2xl font-serif mb-8 leading-tight">IP Strategy Audit</p>
             <button className="w-full py-5 bg-[#CC1414] text-white text-[11px] font-bold tracking-widest uppercase hover:bg-white hover:text-slate-900 transition-all shadow-xl">
                REQUEST AUDIT
             </button>
          </div>
          <div className="p-10 border border-slate-100 bg-white space-y-6 shadow-sm">
             <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-4 pb-2 border-b border-slate-50">QUICK TOOLS</h4>
             <p className="text-[15px] text-slate-700 flex items-center gap-4 cursor-pointer hover:text-[#CC1414] transition-colors"><Zap className="w-5 h-5 text-indigo-600" /> Trademark Search</p>
             <p className="text-[15px] text-slate-700 flex items-center gap-4 cursor-pointer hover:text-[#CC1414] transition-colors"><Briefcase className="w-5 h-5 text-indigo-600" /> Patent Database</p>
          </div>
        </div>
      );
    case 'family':
      return (
        <div className="space-y-10 animate-fade-in delay-500">
          <div className="bg-[#FDF6F6] p-10 md:p-14 border border-red-100 text-center shadow-sm">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md">
                <Users className="w-10 h-10 text-[#CC1414]" />
             </div>
             <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#CC1414] mb-4">PRIVATE COUNSEL</h4>
             <p className="text-2xl font-serif text-slate-900 mb-8 leading-tight">Mediation Inquiry</p>
             <button className="w-full py-5 bg-slate-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-[#CC1414] transition-all shadow-xl">
                BOOK PRIVATELY
             </button>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const PracticeAreaPage: React.FC<PracticeAreaPageProps> = ({ id, onBack, onNavigate }) => {
  const content = CONTENT_MAP[id] || CONTENT_MAP['corp-law'];

  return (
    <div className="animate-fade-in bg-white">
      {/* Practice Hero */}
      <div className="relative min-h-[80vh] flex items-center pt-24 md:pt-32">
        <div className="absolute inset-0 z-0">
          <img src={content.heroImage} className="w-full h-full object-cover grayscale brightness-[0.5]" alt={content.title} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32 w-full pt-20 pb-20">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.3em] uppercase text-white/60 hover:text-white transition-colors mb-16"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO CHAMBERS</span>
          </button>
          <div className="max-w-4xl animate-fade-in-up">
            <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-serif text-white leading-[1.1] mb-8">
              {content.heroHeadline}
            </h1>
            <p className="text-lg md:text-2xl text-white/80 font-light mb-16 max-w-2xl leading-relaxed">
              {content.heroSubtext}
            </p>
            <button className="px-12 py-6 bg-[#CC1414] text-white text-[12px] font-bold tracking-[0.25em] uppercase hover:bg-white hover:text-slate-900 transition-all shadow-2xl">
              REQUEST STRATEGIC CONSULTATION
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="py-24 md:py-40 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-32">
              
              {/* Philosophy */}
              <section>
                <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#CC1414] mb-16 border-b border-slate-100 pb-6">
                  01. {content.philosophy.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {content.philosophy.points.map((p: any, idx: number) => (
                    <div key={idx} className="space-y-6 group">
                      <div className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-[#CC1414] group-hover:border-[#CC1414] transition-all duration-500 shadow-sm">
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white">0{idx+1}</span>
                      </div>
                      <p className="text-2xl font-serif text-slate-900 leading-tight">{p.label}</p>
                      <p className="text-[16px] text-slate-500 font-light leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Coverage */}
              <section className="bg-slate-50 p-12 lg:p-20 border-l-8 border-[#CC1414] shadow-sm">
                <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-12">02. PRACTICE COVERAGE</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                  {content.coverage.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-6 group cursor-default">
                      <div className="w-2 h-2 bg-[#CC1414] rounded-full shrink-0" />
                      <span className="text-2xl font-serif text-slate-800 group-hover:translate-x-3 transition-transform duration-500">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Visual Lifecycle */}
              <section className="py-12">
                <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#CC1414] mb-16">03. MANDATE LIFECYCLE</h2>
                <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 px-4">
                  {['STRATEGY', 'DILIGENCE', 'NEGOTIATION', 'EXECUTION'].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center relative z-10 bg-white px-4">
                      <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-xl mb-6">
                        {idx + 1}
                      </div>
                      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500 text-center">{step}</span>
                    </div>
                  ))}
                  <div className="absolute top-8 left-0 w-full h-px bg-slate-100 z-0 hidden md:block" />
                </div>
              </section>

              {/* Mandates */}
              <section className="pb-12">
                <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#CC1414] mb-16 border-b border-slate-100 pb-6">
                  04. REPRESENTATIVE MANDATES
                </h2>
                <div className="space-y-10">
                  {content.mandates.map((m: string, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row items-start gap-10 p-10 border border-slate-50 hover:border-[#CC1414]/20 hover:shadow-2xl transition-all duration-700 bg-white group">
                      <div className="w-14 h-14 bg-slate-50 flex items-center justify-center text-[#CC1414] shrink-0 font-serif italic text-2xl group-hover:bg-[#CC1414] group-hover:text-white transition-all duration-500 shadow-sm">
                        M
                      </div>
                      <div className="flex-1">
                        <p className="text-2xl font-serif text-slate-800 leading-relaxed mb-6">{m}</p>
                        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400">ANONYMIZED FOR PRIVACY • TIER-1 MANDATE</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit pb-12">
              <Sidebar type={content.sidebarType} onNavigate={onNavigate} />
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeAreaPage;
