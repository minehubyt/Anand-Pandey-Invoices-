
import React, { useState, useEffect } from 'react';
import { Menu, LogOut, Clock, CheckCircle, Search, FileText, Bell, RefreshCw, ChevronRight } from 'lucide-react';
import { auth } from '../../firebase';
import { contentService } from '../../services/contentService';
import { JobApplication } from '../../types';

interface ApplicantDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({ onLogout, onNavigateHome }) => {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = contentService.subscribeUserApplications(user.uid, (data) => {
      setApps(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-20 font-sans">
      <header className="fixed top-0 w-full z-[60] bg-white border-b border-slate-100 h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onNavigateHome} className="p-2 -ml-2 text-slate-900 hover:text-[#CC1414] transition-colors"><Menu size={20}/></button>
          <div className="flex items-center font-sans uppercase tracking-[0.15em] text-slate-900 font-bold text-[13px] md:text-[15px]">CANDIDATE PORTAL</div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
           <button className="p-1 text-slate-400 hover:text-slate-900 transition-colors"><Bell size={18}/></button>
           <div className="w-8 h-8 bg-[#CC1414] rounded-full flex items-center justify-center text-white font-bold font-serif text-sm shadow-lg shadow-red-500/20">{auth.currentUser?.email?.[0].toUpperCase()}</div>
           <button onClick={onLogout} className="p-1 text-slate-400 hover:text-[#CC1414] transition-colors"><LogOut size={18}/></button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 lg:py-20">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Welcome, {auth.currentUser?.displayName || 'Counsel'}</h1>
          <p className="text-slate-500 font-light">Track the real-time status of your active mandates within the chambers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8 space-y-8">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#CC1414] mb-8">ACTIVE APPLICATIONS</h2>
              {loading ? (
                <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-slate-200" /></div>
              ) : apps.length === 0 ? (
                <div className="p-20 bg-white border border-slate-100 rounded-3xl text-center">
                   <FileText size={48} className="mx-auto text-slate-100 mb-6" />
                   <p className="text-xl font-serif text-slate-400 mb-8">No active applications detected.</p>
                   <button onClick={onNavigateHome} className="px-10 py-4 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#CC1414] transition-all">EXPLORE OPEN ROLES</button>
                </div>
              ) : (
                apps.map(app => (
                  <div key={app.id} className="p-8 md:p-10 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                           <div className="flex items-center gap-3 mb-4">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${app.status === 'Received' ? 'bg-blue-50 text-blue-600' : app.status === 'Under Review' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                {app.status}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SUBMITTED {new Date(app.submittedDate).toLocaleDateString()}</span>
                           </div>
                           <h3 className="text-3xl font-serif text-slate-900 group-hover:text-[#CC1414] transition-colors mb-2">{app.jobTitle}</h3>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="flex flex-col items-end">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">PROGRESS</span>
                              <div className="flex gap-1.5">
                                 {[1,2,3,4].map(step => (
                                   <div key={step} className={`w-10 h-1.5 rounded-full ${step <= (app.status === 'Received' ? 1 : app.status === 'Under Review' ? 2 : 3) ? 'bg-[#CC1414]' : 'bg-slate-100'}`} />
                                 ))}
                              </div>
                           </div>
                           <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-all"><ChevronRight size={24}/></button>
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#0A1931] text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#CC1414]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-300 mb-8 border-b border-white/10 pb-4">RECRUITMENT PROTOCOL</h4>
                 <div className="space-y-8">
                    <div className="flex items-start gap-4">
                       <Clock size={18} className="text-[#CC1414] mt-1 shrink-0" />
                       <div><p className="text-[15px] font-bold mb-1">Mandate Timeline</p><p className="text-xs text-blue-100/60 font-light">Most mandates are reviewed within 7-10 business cycles.</p></div>
                    </div>
                    <div className="flex items-start gap-4">
                       <CheckCircle size={18} className="text-[#CC1414] mt-1 shrink-0" />
                       <div><p className="text-[15px] font-bold mb-1">Communication</p><p className="text-xs text-blue-100/60 font-light">Direct communications from Partners will appear here and in your inbox.</p></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
