
import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock as ClockIcon, 
  ChevronRight, ChevronLeft, CheckCircle, 
  MapPin, Globe, User, MessageSquare, ShieldCheck, 
  X, ArrowRight, Sparkles, Loader2, Send, ArrowLeft
} from 'lucide-react';
import { contentService } from '../services/contentService';
import { analyzeLegalQuery } from '../services/geminiService';
import { emailService } from '../services/emailService';

type BookingStep = 'identity' | 'location' | 'purpose' | 'date' | 'time' | 'review';

interface BookingPageProps {
  onBack: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ onBack }) => {
  const [step, setStep] = useState<BookingStep>('identity');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'India',
    branch: 'New Delhi',
    purpose: 'Corporate Advisory',
    query: '',
    date: new Date(),
    time: { hour: '09', minute: '00', period: 'AM' }
  });

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const nextStep = () => {
    if (step === 'identity') setStep('location');
    else if (step === 'location') setStep('purpose');
    else if (step === 'purpose') setStep('date');
    else if (step === 'date') setStep('time');
    else if (step === 'time') setStep('review');
  };

  const prevStep = () => {
    if (step === 'location') setStep('identity');
    else if (step === 'purpose') setStep('location');
    else if (step === 'date') setStep('purpose');
    else if (step === 'time') setStep('date');
    else if (step === 'review') setStep('time');
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const uniqueId = `AKP-${Math.floor(100000 + Math.random() * 900000)}`;
      await contentService.addInquiry({
        type: 'appointment',
        name: bookingData.name,
        email: bookingData.email,
        details: {
          ...bookingData,
          uniqueId,
          aiAnalysis
        }
      });
      
      // Trigger Strategic Email Communication (Simulated)
      await emailService.sendBookingConfirmation({
        ...bookingData,
        uniqueId
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error("Booking failed", error);
      alert('Network protocol error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQueryBlur = async () => {
    if (bookingData.query.length > 15) {
      setIsAnalyzing(true);
      const res = await analyzeLegalQuery(bookingData.query);
      setAiAnalysis(res);
      setIsAnalyzing(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="max-w-3xl mx-auto px-8 text-center animate-page-fade">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
             <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Mandate Authorized</h2>
          <p className="text-xl text-slate-500 font-light leading-relaxed mb-12">
            Your appointment has been securely logged into the Chamber Matrix and a confirmation email has been dispatched. A Strategic Liaison will contact you shortly to confirm the technical details of your session.
          </p>
          <button 
            onClick={onBack}
            className="px-12 py-5 bg-slate-900 text-white font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-[#CC1414] transition-all"
          >
            RETURN TO CHAMBERS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7FE] min-h-screen pt-20 pb-20 font-sans">
      <header className="fixed top-0 w-full z-[60] bg-white border-b border-slate-100 h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-900 hover:text-[#CC1414] transition-colors">
             <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center font-sans uppercase tracking-[0.15em] text-slate-900 font-bold text-[13px] md:text-[15px]">
             STRATEGIC INTAKE
          </div>
        </div>
        <div className="flex items-baseline font-sans uppercase tracking-[0.08em] text-slate-900 font-bold text-[11px] md:text-[13px] hidden sm:flex">
           AK PANDEY <span className="text-[9px] md:text-[10px] mx-1">&</span> ASSOCIATES
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-4 lg:sticky lg:top-32">
             <div className="space-y-8 animate-reveal-up">
                <div>
                   <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#CC1414] mb-4">Strategic Intake</h2>
                   <h3 className="text-4xl xl:text-5xl font-serif text-slate-900 leading-tight">Secure Your Private Consultation</h3>
                </div>
                <p className="text-lg text-slate-500 font-light leading-relaxed">
                  We operate on a secure, multi-stage protocol to ensure your mandate is handled with absolute priority and discretion.
                </p>
                <div className="space-y-4 pt-8">
                   <ProgressStep active={step === 'identity'} completed={['location', 'purpose', 'date', 'time', 'review'].includes(step)} label="Liaison Identity" />
                   <ProgressStep active={step === 'location'} completed={['purpose', 'date', 'time', 'review'].includes(step)} label="Geo-Context" />
                   <ProgressStep active={step === 'purpose'} completed={['date', 'time', 'review'].includes(step)} label="Mandate Scope" />
                   <ProgressStep active={step === 'date' || step === 'time'} completed={['review'].includes(step)} label="Temporal Sync" />
                   <ProgressStep active={step === 'review'} completed={false} label="Final Authorization" />
                </div>
                <div className="pt-12 flex items-center gap-4 text-slate-400">
                   <ShieldCheck className="w-5 h-5" />
                   <span className="text-[10px] font-bold tracking-[0.2em] uppercase">AES-256 Encrypted Channel</span>
                </div>
             </div>
          </div>

          <div className="lg:col-span-8">
             <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col min-h-[600px] relative border border-slate-100 animate-reveal-up stagger-1">
                <div className="flex-1 p-8 md:p-16 lg:p-20 overflow-y-auto no-scrollbar">
                   {step === 'identity' && (
                      <div className="animate-reveal-up space-y-12">
                         <header className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner"><User size={28}/></div>
                            <div>
                               <h4 className="text-3xl font-serif text-slate-900">Personal Identity</h4>
                               <p className="text-slate-400 font-light mt-1">Please provide official contact credentials.</p>
                            </div>
                         </header>
                         <div className="space-y-10">
                            <InputField label="Full Name" value={bookingData.name} onChange={v => setBookingData({...bookingData, name: v})} placeholder="E.g. Rajesh Kumar" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                               <InputField label="Email Address" type="email" value={bookingData.email} onChange={v => setBookingData({...bookingData, email: v})} placeholder="E.g. r.kumar@global.com" />
                               <InputField label="Direct Phone" type="tel" value={bookingData.phone} onChange={v => setBookingData({...bookingData, phone: v})} placeholder="+91 XXX-XXX-XXXX" />
                            </div>
                         </div>
                      </div>
                   )}

                   {step === 'location' && (
                      <div className="animate-reveal-up space-y-12">
                         <header className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner"><Globe size={28}/></div>
                            <div>
                               <h4 className="text-3xl font-serif text-slate-900">Geographic Matrix</h4>
                               <p className="text-slate-400 font-light mt-1">Select your jurisdiction and preferred chamber.</p>
                            </div>
                         </header>
                         <div className="space-y-10">
                            <div className="space-y-4">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Requesting Country</label>
                               <select 
                                 value={bookingData.country}
                                 onChange={e => setBookingData({...bookingData, country: e.target.value})}
                                 className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-1 focus:ring-[#CC1414] outline-none font-light text-lg"
                               >
                                  <option>India</option>
                                  <option>Singapore</option>
                                  <option>United Kingdom</option>
                                  <option>USA</option>
                                  <option>UAE</option>
                               </select>
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Preferred Branch Office</label>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {['New Delhi', 'Lucknow', 'Virtual Chamber'].map(b => (
                                     <button 
                                       key={b}
                                       onClick={() => setBookingData({...bookingData, branch: b})}
                                       className={`p-6 rounded-2xl border text-left transition-all ${bookingData.branch === b ? 'border-[#CC1414] bg-[#CC1414]/5 ring-1 ring-[#CC1414]' : 'border-slate-100 hover:border-slate-300'}`}
                                     >
                                        <p className={`font-serif text-xl ${bookingData.branch === b ? 'text-[#CC1414]' : 'text-slate-900'}`}>{b}</p>
                                     </button>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                   )}

                   {step === 'purpose' && (
                      <div className="animate-reveal-up space-y-12">
                         <header className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner"><MessageSquare size={28}/></div>
                            <div>
                               <h4 className="text-3xl font-serif text-slate-900">Mandate Scope</h4>
                               <p className="text-slate-400 font-light mt-1">Briefly outline the legal requirements.</p>
                            </div>
                         </header>
                         <div className="space-y-10">
                            <div className="space-y-4">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Service Category</label>
                               <div className="flex flex-wrap gap-4">
                                  {['Corporate', 'Criminal', 'Civil', 'IP', 'Other'].map(p => (
                                     <button 
                                       key={p}
                                       onClick={() => setBookingData({...bookingData, purpose: p})}
                                       className={`px-8 py-3 rounded-full border text-[12px] font-bold uppercase tracking-widest transition-all ${bookingData.purpose === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                     >
                                        {p}
                                     </button>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-4 relative">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Context Summary</label>
                               <textarea 
                                 value={bookingData.query}
                                 onChange={e => setBookingData({...bookingData, query: e.target.value})}
                                 onBlur={handleQueryBlur}
                                 rows={5}
                                 className="w-full p-8 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-1 focus:ring-[#CC1414] font-light text-lg resize-none shadow-inner"
                                 placeholder="Tell us about the challenge..."
                               />
                               {isAnalyzing && (
                                  <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-xl border border-[#CC1414]/10 animate-pulse">
                                     <Loader2 className="w-4 h-4 animate-spin text-[#CC1414]" />
                                     <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">AI Categorization Active</span>
                                  </div>
                               )}
                            </div>
                            {aiAnalysis && (
                               <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 animate-reveal-up">
                                  <div className="flex items-center gap-3 mb-4">
                                     <Sparkles className="w-4 h-4 text-blue-600" />
                                     <span className="text-[10px] font-bold uppercase text-blue-600 tracking-widest">Smart Intake Suggestion</span>
                                  </div>
                                  <p className="text-slate-600 text-[15px] font-light leading-relaxed">
                                     Based on your context, this mandate falls under <span className="font-bold text-slate-900">{aiAnalysis.suggestedPracticeArea}</span> with <span className="font-bold text-slate-900">{aiAnalysis.urgency} priority</span>.
                                  </p>
                               </div>
                            )}
                         </div>
                      </div>
                   )}

                   {step === 'date' && (
                      <div className="animate-reveal-up space-y-12">
                         <header className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner"><CalendarIcon size={28}/></div>
                               <div>
                                  <h4 className="text-3xl font-serif text-slate-900">Select Date</h4>
                                  <p className="text-slate-400 font-light mt-1">Pick a preferred window for the session.</p>
                               </div>
                            </div>
                         </header>
                         <CalendarUI selectedDate={bookingData.date} onChange={d => setBookingData({...bookingData, date: d})} />
                      </div>
                   )}

                   {step === 'time' && (
                      <div className="animate-reveal-up space-y-12">
                         <header className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner"><ClockIcon size={28}/></div>
                               <div>
                                  <h4 className="text-3xl font-serif text-slate-900">Set Time</h4>
                                  <p className="text-slate-400 font-light mt-1">Specify the precise timing in IST.</p>
                               </div>
                            </div>
                         </header>
                         <ClockUI 
                           time={bookingData.time} 
                           onChange={t => setBookingData({...bookingData, time: t})} 
                         />
                      </div>
                   )}

                   {step === 'review' && (
                      <div className="animate-reveal-up space-y-12">
                         <header>
                            <h4 className="text-3xl font-serif text-slate-900">Verification</h4>
                            <p className="text-slate-400 font-light mt-1">Authorize the final strategic briefing details.</p>
                         </header>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ReviewItem label="Lead Liaison" value={bookingData.name} />
                            <ReviewItem label="Email" value={bookingData.email} />
                            <ReviewItem label="Jurisdiction" value={`${bookingData.branch}, ${bookingData.country}`} />
                            <ReviewItem label="Schedule" value={`${bookingData.date.toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric'})} at ${bookingData.time.hour}:${bookingData.time.minute} ${bookingData.time.period}`} />
                            <div className="md:col-span-2">
                               <ReviewItem label="Mandate Context" value={bookingData.query || 'Proprietary case overview provided.'} />
                            </div>
                         </div>
                         <div className="p-8 bg-slate-50 rounded-3xl flex items-start gap-6">
                            <ShieldCheck className="w-8 h-8 text-[#CC1414] shrink-0" />
                            <p className="text-sm text-slate-500 leading-relaxed font-light">
                               By authorizing this request, you agree that these details will be transmitted over an encrypted channel to AK Pandey & Associates. All communications remain subject to legal professional privilege.
                            </p>
                         </div>
                      </div>
                   )}
                </div>

                <div className="p-8 md:px-16 md:py-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                   <button 
                     onClick={step === 'identity' ? undefined : prevStep}
                     className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest ${step === 'identity' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-900 transition-colors'}`}
                   >
                      <ChevronLeft size={16} /> Previous
                   </button>
                   
                   {step === 'review' ? (
                      <button 
                        onClick={handleFinalSubmit}
                        disabled={loading}
                        className="px-14 py-5 bg-[#CC1414] text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl shadow-red-500/30 hover:scale-105 transition-all flex items-center gap-4 disabled:opacity-50"
                      >
                         {loading ? 'TRANSMITTING...' : 'AUTHORIZE SESSION'}
                         <Send size={16} />
                      </button>
                   ) : (
                      <button 
                        onClick={nextStep}
                        className="px-14 py-5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-[#CC1414] transition-all flex items-center gap-4"
                      >
                         Next Phase
                         <ChevronRight size={16} />
                      </button>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressStep: React.FC<{ active: boolean, completed: boolean, label: string }> = ({ active, completed, label }) => (
  <div className="flex items-center gap-4 group">
     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${active ? 'border-[#CC1414] bg-[#CC1414] text-white shadow-lg' : completed ? 'border-green-500 bg-green-500 text-white' : 'border-slate-200 text-slate-300'}`}>
        {completed ? <CheckCircle size={14} /> : null}
        {!completed && <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-transparent'}`} />}
     </div>
     <span className={`text-[12px] font-bold uppercase tracking-widest transition-colors ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
  </div>
);

const InputField: React.FC<{ label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-4">
     <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
     <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b-2 border-slate-100 py-4 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-xl text-slate-900 bg-transparent placeholder:text-slate-200"
     />
  </div>
);

const ReviewItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-3xl">
     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
     <p className="text-xl font-serif text-slate-900 leading-tight">{value}</p>
  </div>
);

const CalendarUI: React.FC<{ selectedDate: Date, onChange: (d: Date) => void }> = ({ selectedDate, onChange }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = [];
  for (let i = 0; i < startDay; i++) days.push({ day: null });
  for (let i = 1; i <= daysInMonth(viewDate.getMonth(), viewDate.getFullYear()); i++) {
    days.push({ day: i, date: new Date(viewDate.getFullYear(), viewDate.getMonth(), i) });
  }
  const isSelected = (date?: Date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
       <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-100">
          <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronLeft size={18}/></button>
          <span className="font-serif text-lg">{monthNames[viewDate.getMonth()]}, {viewDate.getFullYear()}</span>
          <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronRight size={18}/></button>
       </div>
       <div className="p-6">
          <div className="grid grid-cols-7 mb-4">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold uppercase text-slate-300 tracking-tighter">{d}</div>
             ))}
          </div>
          <div className="grid grid-cols-7 gap-y-2">
             {days.map((d, i) => (
                <div key={i} className="flex justify-center items-center">
                   {d.day && (
                      <button 
                        onClick={() => onChange(d.date!)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${isSelected(d.date) ? 'bg-[#CC1414] text-white shadow-lg shadow-red-500/20 ring-4 ring-white' : 'hover:bg-slate-50 text-slate-600'}`}
                      >
                         {d.day < 10 ? `0${d.day}` : d.day}
                      </button>
                   )}
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const ClockUI: React.FC<{ time: any, onChange: (t: any) => void }> = ({ time, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-12 py-8">
       <div className="relative w-64 h-64 rounded-full border-8 border-slate-900 bg-white shadow-2xl flex items-center justify-center group">
          <div className="absolute top-4 font-bold text-[10px] text-slate-300 tracking-widest">CHAMBER TIME</div>
          <div className="w-1 h-20 bg-slate-900 rounded-full absolute origin-bottom bottom-1/2 transform rotate-[45deg]" />
          <div className="w-1 h-14 bg-slate-900 rounded-full absolute origin-bottom bottom-1/2 transform -rotate-[90deg]" />
          <div className="w-0.5 h-24 bg-[#CC1414] rounded-full absolute origin-bottom bottom-1/2 transform rotate-[190deg]" />
          <div className="w-4 h-4 bg-slate-900 rounded-full z-10 border-2 border-white shadow-sm" />
          {[...Array(12)].map((_, i) => (
             <div key={i} className="absolute inset-2 text-center" style={{ transform: `rotate(${i * 30}deg)` }}>
                <div className="w-0.5 h-2 bg-slate-200 mx-auto" />
             </div>
          ))}
       </div>
       <div className="flex gap-4">
          <ClockField label="HH" value={time.hour} onChange={v => onChange({...time, hour: v})} options={Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'))} />
          <div className="text-3xl font-serif text-slate-300 pt-8">:</div>
          <ClockField label="MM" value={time.minute} onChange={v => onChange({...time, minute: v})} options={['00', '15', '30', '45']} />
          <div className="w-12" />
          <ClockField label="P." value={time.period} onChange={v => onChange({...time, period: v})} options={['AM', 'PM']} wide />
       </div>
    </div>
  );
};

const ClockField: React.FC<{ label: string, value: string, onChange: (v: string) => void, options: string[], wide?: boolean }> = ({ label, value, onChange, options, wide }) => (
  <div className="flex flex-col items-center gap-3">
     <span className="text-[10px] font-bold text-slate-300 tracking-[0.2em]">{label}</span>
     <div className="relative group">
        <select 
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`appearance-none bg-slate-50 border border-slate-100 py-4 px-6 rounded-2xl font-serif text-xl focus:ring-1 focus:ring-[#CC1414] outline-none cursor-pointer transition-all ${wide ? 'min-w-[100px]' : 'min-w-[80px]'}`}
        >
           {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 transition-transform group-hover:translate-y-[-2px]"><ChevronRight className="rotate-90" size={14}/></div>
     </div>
  </div>
);

export default BookingPage;
