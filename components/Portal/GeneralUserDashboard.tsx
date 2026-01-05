
import React, { useState, useEffect } from 'react';
import { Menu, LogOut, Clock, CheckCircle, Search, FileText, Bell, RefreshCw, ChevronRight, Calendar, MessageSquare, Briefcase, User, ArrowRight } from 'lucide-react';
import { auth } from '../../firebase';
import { contentService } from '../../services/contentService';
import { Inquiry } from '../../types';
import BookingPage from '../BookingPage';

interface GeneralUserDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

type FilterType = 'all' | 'appointment' | 'rfp' | 'contact';

const GeneralUserDashboard: React.FC<GeneralUserDashboardProps> = ({ onLogout, onNavigateHome }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = contentService.subscribeUserInquiries(user.uid, (data) => {
      setInquiries(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.type === filter);

  if (showBooking) {
    return <BookingPage onBack={() => setShowBooking(false)} />;
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-20 font-sans">
      <header className="fixed top-0 w-full z-[60] bg-white border-b border-slate-100 h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onNavigateHome} className="p-2 -ml-2 text-slate-900 hover:text-[#CC1414] transition-colors"><Menu size={20}/></button>
          <div className="flex items-center font-sans uppercase tracking-[0.15em] text-slate-900 font-bold text-[13px] md:text-[15px]">CLIENT CONSOLE</div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
           <button className="p-1 text-slate-400 hover:text-slate-900 transition-colors"><Bell size={18}/></button>
           <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold font-serif shadow-lg">{auth.currentUser?.email?.[0].toUpperCase()}</div>
           <button onClick={onLogout} className="p-1 text-slate-400 hover:text-[#CC1414] transition-colors"><LogOut size={18}/></button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Good Day, {auth.currentUser?.displayName || 'Client'}</h1>
            <p className="text-slate-500 font-light">Monitor your mandates, appointments, and strategic inquiries.</p>
          </div>
          <button 
             onClick={() => setShowBooking(true)}
             className="px-8 py-4 bg-[#CC1414] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-slate-900 transition-all rounded-lg shadow-xl flex items-center gap-3"
          >
             Book Consultation <ArrowRight size={14}/>
          </button>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-8 w-fit">
           {(['all', 'appointment', 'rfp', 'contact'] as FilterType[]).map(t => (
             <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${filter === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
             >
               {t}s
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8 space-y-6">
              {loading ? (
                <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-slate-200" /></div>
              ) : filtered.length === 0 ? (
                <div className="p-20 bg-white border border-slate-100 rounded-3xl text-center">
                   <MessageSquare size={48} className="mx-auto text-slate-100 mb-6" />
                   <p className="text-xl font-serif text-slate-400 mb-8">No active mandates found in this category.</p>
                   <button onClick={() => setShowBooking(true)} className="px-10 py-4 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#CC1414] transition-all">START NEW MANDATE</button>
                </div>
              ) : (
                filtered.map(inquiry => (
                  <div key={inquiry.id} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex gap-6 items-start">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${inquiry.type === 'appointment' ? 'bg-blue-50 text-blue-600' : inquiry.type === 'rfp' ? 'bg-red-50 text-[#CC1414]' : 'bg-slate-100 text-slate-600'}`}>
                              {inquiry.type === 'appointment' ? <Calendar size={24}/> : inquiry.type === 'rfp' ? <Briefcase size={24}/> : <MessageSquare size={24}/>}
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{inquiry.uniqueId}</span>
                                 <div className="w-1 h-1 rounded-full bg-slate-200" />
                                 <span className="text-[9px] font-bold uppercase tracking-widest text-[#CC1414]">{inquiry.status}</span>
                              </div>
                              <h3 className="text-2xl font-serif text-slate-900 group-hover:text-[#CC1414] transition-colors mb-2">
                                {inquiry.type === 'appointment' ? `Consultation: ${inquiry.details.branch}` : inquiry.type === 'rfp' ? `Mandate RFP: ${inquiry.details.companyName || 'Corporate'}` : 'General Inquiry'}
                              </h3>
                              <p className="text-sm text-slate-400 font-light">{new Date(inquiry.date).toLocaleDateString()} at {new Date(inquiry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                           </div>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                           View Details <ChevronRight size={16}/>
                        </button>
                     </div>
                  </div>
                ))
              )}
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                 <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#CC1414] border-b border-slate-50 pb-4">CLIENT IDENTITY</h4>
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300"><User size={28}/></div>
                    <div>
                       <p className="text-xl font-serif">{auth.currentUser?.displayName}</p>
                       <p className="text-xs text-slate-400">{auth.currentUser?.email}</p>
                    </div>
                 </div>
              </div>

              <div className="bg-[#0A1931] text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#CC1414]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-300 mb-8 border-b border-white/10 pb-4">CONCIERGE DESK</h4>
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <Clock size={18} className="text-[#CC1414] mt-1 shrink-0" />
                       <div><p className="text-sm font-bold mb-1">Standard SLA</p><p className="text-[11px] text-blue-100/60 font-light">Mandates are typically assigned within 4 strategic hours.</p></div>
                    </div>
                    <button onClick={() => setShowBooking(true)} className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#CC1414] transition-all rounded-xl mt-4">
                       Book Priority Session
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralUserDashboard;
