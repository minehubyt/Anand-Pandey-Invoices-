import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Upload, User, BookOpen, Heart, CheckCircle, FileText, Loader2, Sparkles, Camera, X, Trash2 } from 'lucide-react';
import { parseResume } from '../../services/geminiService';
import { contentService } from '../../services/contentService';
import { emailService } from '../../services/emailService';
import { auth } from '../../firebase';
import { Job } from '../../types';

interface ApplyFormProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

type Slide = 'intro' | 'personal' | 'professional' | 'interests' | 'resume' | 'confirm';

const ApplyForm: React.FC<ApplyFormProps> = ({ job, onClose, onSuccess }) => {
  const [slide, setSlide] = useState<Slide>('intro');
  const [loading, setLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: auth.currentUser?.email || '',
    mobile: '',
    photo: '',
    education: '',
    experience: '',
    interests: '',
    resumeUrl: '', // Stores filename or placeholder
    resumeBase64: '' // Stores actual file data (kept in state only, not sent to DB)
  });

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>, isManual = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isManual) {
        // Just store the file for manual submission
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target?.result as string;
            setFormData(prev => ({
                ...prev,
                resumeUrl: file.name, // Store filename
                resumeBase64: base64String // Store content for email
            }));
        };
        reader.readAsDataURL(file);
        return;
    }

    // AI Parsing Path
    setIsParsing(true);
    try {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64String = event.target?.result as string;
            const mimeType = file.type || 'application/pdf';

            try {
                const parsed = await parseResume(base64String, mimeType);
                
                if (parsed) {
                    setFormData(prev => ({
                        ...prev,
                        name: parsed.name || prev.name,
                        email: parsed.email || prev.email,
                        mobile: parsed.mobile || prev.mobile,
                        education: parsed.education || prev.education,
                        experience: parsed.experience || prev.experience,
                        interests: parsed.interests || prev.interests,
                        resumeUrl: 'AI_PARSED_' + file.name,
                        resumeBase64: base64String
                    }));
                    
                    setTimeout(() => {
                        setIsParsing(false);
                        setSlide('personal');
                    }, 500);
                } else {
                    throw new Error("Parsing returned null");
                }
            } catch (err) {
                console.error("Parsing logic error", err);
                setIsParsing(false);
                alert("We couldn't auto-read this document format. Please enter details manually.");
            }
        };
        reader.readAsDataURL(file);
    } catch (err) {
        setIsParsing(false);
        console.error(err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Prepare lightweight object for Firestore (Limit < 1MB)
    // We DO NOT save the full base64 resume string to Firestore to prevent hanging.
    const appForDb = {
      jobId: job.id,
      jobTitle: job.title,
      userId: auth.currentUser?.uid || 'anonymous',
      status: 'Received' as const,
      submittedDate: new Date().toISOString(),
      data: {
        personal: {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          photo: formData.photo // Photo usually small enough, or ideally should be a URL
        },
        education: formData.education,
        experience: formData.experience,
        interests: formData.interests,
        resumeUrl: formData.resumeUrl || 'Not Attached' 
      }
    };

    try {
      // 1. Submit Data (Fast - lightweight text only)
      await contentService.submitApplication(appForDb);
      
      // 2. Trigger Strategic Email (Background / Fire-and-Forget)
      // We pass the full formData including base64 so the email service can attach it (if implemented)
      // or at least have the data.
      emailService.sendApplicationConfirmation({
        name: formData.name,
        email: formData.email,
        jobTitle: job.title,
        formData: formData 
      }).catch(err => console.error("Background email send failed:", err));
      
      setLoading(false);
      onSuccess();
    } catch (err) {
      console.error('Submission Error:', err);
      setLoading(false);
      alert("Submission encountered an error. Please try again.");
    }
  };

  const slides: Slide[] = ['intro', 'personal', 'professional', 'interests', 'resume', 'confirm'];
  const currentIndex = slides.indexOf(slide);

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto no-scrollbar font-sans">
      <header className="fixed top-0 w-full z-[110] bg-white border-b border-slate-100 h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-900 hover:text-[#CC1414] transition-colors"><X size={20}/></button>
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">APPLYING FOR: <span className="text-slate-900">{job.title.toUpperCase()}</span></span>
        </div>
        <div className="flex items-center gap-3">
           {slides.map((s, idx) => (
             <div key={s} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${idx <= currentIndex ? 'bg-[#CC1414] w-4' : 'bg-slate-100'}`} />
           ))}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {slide === 'intro' && (
          <div className="animate-reveal-up text-center">
            <h2 className="text-6xl font-serif text-slate-900 mb-8">Begin Your Application</h2>
            <p className="text-xl text-slate-500 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
              Experience our AI-integrated recruitment process. You can upload your resume to auto-populate the dossier or fill it manually with precision.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
               <label className={`p-12 border-2 border-dashed border-slate-100 bg-slate-50 hover:border-[#CC1414] hover:bg-white transition-all cursor-pointer group relative overflow-hidden ${isParsing ? 'pointer-events-none opacity-80' : ''}`}>
                  {isParsing && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                       <Loader2 className="animate-spin text-[#CC1414]" size={32} />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Analysing Document...</span>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={(e) => handleResumeUpload(e, false)} accept=".pdf,image/*" />
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                     <Sparkles className="text-[#CC1414]" size={32} />
                  </div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-2">Upload Resume</h3>
                  <p className="text-sm text-slate-400 font-light">PDF or Image format supported.</p>
               </label>
               <button onClick={() => setSlide('personal')} className="p-12 border border-slate-100 bg-white hover:border-slate-900 hover:shadow-2xl transition-all group">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                     <User className="text-slate-900" size={32} />
                  </div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-2">Manual Entry</h3>
                  <p className="text-sm text-slate-400 font-light">Craft your profile step-by-step.</p>
               </button>
            </div>
          </div>
        )}

        {slide === 'personal' && (
          <div className="animate-reveal-up space-y-12">
            <h2 className="text-5xl font-serif text-slate-900">Personal Dossier</h2>
            <div className="flex flex-col md:flex-row gap-12">
               <div className="w-48 h-48 bg-slate-100 rounded-3xl overflow-hidden shrink-0 border-2 border-slate-50 group cursor-pointer relative">
                  {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-300"><Camera size={40}/><span className="text-[9px] font-bold uppercase tracking-widest mt-2">Add Photo</span></div>}
               </div>
               <div className="flex-1 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                        <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border-b-2 border-slate-100 focus:border-[#CC1414] outline-none text-xl font-light" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Official Mobile</label>
                        <input value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full p-4 bg-slate-50 border-b-2 border-slate-100 focus:border-[#CC1414] outline-none text-xl font-light" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                     <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-slate-50/50 border-b-2 border-slate-100 text-slate-400 outline-none text-xl font-light" />
                  </div>
               </div>
            </div>
          </div>
        )}

        {slide === 'professional' && (
          <div className="animate-reveal-up space-y-12">
             <h2 className="text-5xl font-serif text-slate-900">Professional Pedigree</h2>
             <div className="space-y-10">
                <div className="space-y-4">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Academic History</label>
                   <textarea rows={4} value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 focus:border-[#CC1414] outline-none text-lg font-light resize-none" placeholder="University, Law School, Year of Graduation..." />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mandate & Employment History</label>
                   <textarea rows={6} value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 focus:border-[#CC1414] outline-none text-lg font-light resize-none" placeholder="Previous Law Firms, Chambers, Significant Cases..." />
                </div>
             </div>
          </div>
        )}

        {slide === 'interests' && (
          <div className="animate-reveal-up space-y-12">
             <h2 className="text-5xl font-serif text-slate-900">The Individual</h2>
             <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hobbies & Interests beyond the Law</label>
                <textarea rows={6} value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})} className="w-full p-8 bg-slate-50 border border-slate-100 focus:border-[#CC1414] outline-none text-xl font-light italic resize-none" placeholder="What drives you when the chambers are closed?" />
             </div>
          </div>
        )}

        {slide === 'resume' && (
          <div className="animate-reveal-up text-center space-y-12">
             <h2 className="text-5xl font-serif text-slate-900">Final Verification</h2>
             <div className="max-w-2xl mx-auto p-16 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50 flex flex-col items-center gap-6 relative">
                {formData.resumeUrl ? (
                    <>
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#CC1414]">
                            <FileText size={32}/>
                        </div>
                        <div>
                            <p className="text-lg font-serif text-slate-900 mb-1">Document Attached</p>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">{formData.resumeUrl}</p>
                        </div>
                        <button 
                            onClick={() => setFormData({...formData, resumeUrl: '', resumeBase64: ''})}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 size={20}/>
                        </button>
                    </>
                ) : (
                    <>
                        <FileText className="text-slate-200" size={64}/>
                        <p className="text-lg text-slate-500 font-light">Please ensure your latest CV is attached for the Partner Review board.</p>
                        <label className="px-10 py-4 bg-white border border-slate-200 text-slate-900 text-[11px] font-bold tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-3 cursor-pointer">
                            <Upload size={16}/> ATTACH PDF
                            <input type="file" className="hidden" onChange={(e) => handleResumeUpload(e, true)} accept=".pdf,image/*" />
                        </label>
                    </>
                )}
             </div>
          </div>
        )}

        {slide === 'confirm' && (
           <div className="animate-reveal-up space-y-12">
              <h2 className="text-5xl font-serif text-slate-900">Mandate Authorization</h2>
              <div className="bg-slate-50 p-12 rounded-2xl border border-slate-100 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Identity</p><p className="text-xl font-serif">{formData.name}</p></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p><p className="text-xl font-serif">Verified Citizen</p></div>
                 </div>
                 <div className="h-px bg-slate-200" />
                 <p className="text-sm text-slate-500 font-light leading-relaxed">
                   By submitting this dossier, you certify that the information provided is factually accurate. AK Pandey & Associates operates with absolute discretion. Your data will be stored securely in our Mandate Cloud.
                 </p>
              </div>
           </div>
        )}

        {slide !== 'intro' && (
          <div className="fixed bottom-0 left-0 w-full p-6 md:p-8 bg-white/80 backdrop-blur-md border-t border-slate-100 z-[120]">
             <div className="max-w-4xl mx-auto flex justify-between items-center">
                <button 
                  onClick={() => setSlide(slides[currentIndex - 1])}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                   <ChevronLeft size={16}/> Previous
                </button>
                {slide === 'confirm' ? (
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-12 py-5 bg-[#CC1414] text-white text-[12px] font-bold tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                  >
                     {loading ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle size={18}/>}
                     {loading ? 'TRANSMITTING...' : 'AUTHORIZE SUBMISSION'}
                  </button>
                ) : (
                  <button 
                    onClick={() => setSlide(slides[currentIndex + 1])}
                    className="px-12 py-5 bg-slate-900 text-white text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-[#CC1414] transition-all flex items-center gap-3 shadow-xl"
                  >
                     Next Stage <ChevronRight size={16}/>
                  </button>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyForm;