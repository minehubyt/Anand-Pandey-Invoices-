
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, FileUp, CheckCircle, Info, ChevronRight, ChevronLeft, Shield, Clock, Award, Menu, Trash2 } from 'lucide-react';
import { emailService } from '../services/emailService';

interface RFPPageProps {
  onBack: () => void;
}

const STEPS = [
  { id: 1, title: 'Identity', subtitle: 'Contact Details' },
  { id: 2, title: 'Organization', subtitle: 'Company Info' },
  { id: 3, title: 'Scope', subtitle: 'Project Specs' },
  { id: 4, title: 'Confirmation', subtitle: 'Finalize & Submit' }
];

const RFPPage: React.FC<RFPPageProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    industry: 'Technology & AI',
    spend: 'Undisclosed',
    category: 'M&A Advisory',
    summary: '',
    attachmentName: ''
  });

  useEffect(() => {
    setAnimationClass('');
    const timer = setTimeout(() => setAnimationClass('animate-fade-in-up'), 10);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachmentName: file.name }));
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, attachmentName: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Trigger Strategic Email Communication (Simulated)
    try {
      await emailService.sendRFPConfirmation(formData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Transmission error", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-40 animate-fade-in bg-white min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <div className="mb-12 flex justify-center">
            <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center animate-bounce shadow-inner">
              <CheckCircle className="w-14 h-14 text-[#CC1414]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight">Engagement Initiated</h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light mb-16 leading-relaxed max-w-2xl mx-auto">
            Your Request for Proposal has been routed to our Senior Partners and a confirmation email has been dispatched. A strategic advisor will be assigned to your case within the next business cycle.
          </p>
          <button 
            onClick={onBack}
            className="px-14 py-6 bg-slate-900 text-white font-bold text-[12px] uppercase tracking-[0.3em] hover:bg-[#CC1414] transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
          >
            RETURN TO CHAMBERS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-32 md:pb-48 bg-[#FBFBFB] min-h-screen">
       {/* Standardized Header */}
       <header className="fixed top-0 w-full z-[60] bg-white border-b border-slate-100 h-16 px-4 md:px-8 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-900 hover:text-[#CC1414] transition-colors">
             <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center font-sans uppercase tracking-[0.15em] text-slate-900 font-bold text-[13px] md:text-[15px]">
             STRATEGIC RFP
          </div>
        </div>
        <div className="flex items-baseline font-sans uppercase tracking-[0.08em] text-slate-900 font-bold text-[11px] md:text-[13px] hidden sm:flex">
           AK PANDEY <span className="text-[9px] md:text-[10px] mx-1">&</span> ASSOCIATES
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12">
        {/* Navigation & Title */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-20">
          <div className="animate-fade-in">
            <button 
              onClick={onBack}
              className="group flex items-center space-x-3 text-[11px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-[#CC1414] transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" />
              <span>BACK TO GLOBAL SITE</span>
            </button>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-slate-900 leading-tight">
              Submit an RFP
            </h1>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center space-x-4 md:space-x-6 animate-fade-in delay-200">
            {STEPS.map((step) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-700 border-2 ${
                      currentStep >= step.id 
                        ? 'bg-[#CC1414] border-[#CC1414] text-white shadow-xl scale-110' 
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : `0${step.id}`}
                  </div>
                  <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mt-4 hidden md:block ${currentStep === step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                </div>
                {step.id !== STEPS.length && (
                  <div className={`h-px w-6 md:w-16 transition-all duration-1000 ${currentStep > step.id ? 'bg-[#CC1414]' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <div className="bg-white shadow-2xl border border-slate-50 min-h-[650px] flex flex-col relative overflow-hidden rounded-sm">
              
              <div 
                className="absolute top-0 left-0 h-1.5 bg-[#CC1414] transition-all duration-1000 ease-in-out z-20" 
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />

              <form onSubmit={handleSubmit} className="p-8 md:p-16 lg:p-20 flex-1 flex flex-col">
                
                <div className={`flex-1 transition-all duration-700 ease-out ${animationClass}`}>
                  
                  {currentStep === 1 && (
                    <div className="space-y-16">
                      <header>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Primary Liaison</h2>
                        <p className="text-lg text-slate-500 font-light">Enter the details of the individual coordinating this engagement.</p>
                      </header>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                        <div className="group space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#CC1414] transition-colors">First Name *</label>
                          <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-xl text-slate-900 bg-transparent" placeholder="John" />
                        </div>
                        <div className="group space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#CC1414] transition-colors">Last Name *</label>
                          <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-xl text-slate-900 bg-transparent" placeholder="Doe" />
                        </div>
                        <div className="group space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#CC1414] transition-colors">Institutional Email *</label>
                          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-xl text-slate-900 bg-transparent" placeholder="john.doe@company.com" />
                        </div>
                        <div className="group space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#CC1414] transition-colors">Direct Phone</label>
                          <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-xl text-slate-900 bg-transparent" placeholder="+1 (555) 000-0000" />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-16">
                      <header>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Corporate Context</h2>
                        <p className="text-lg text-slate-500 font-light">Tell us more about the organization seeking counsel.</p>
                      </header>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                        <div className="group md:col-span-2 space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#CC1414] transition-colors">Organization Name *</label>
                          <input required type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-xl text-slate-900 bg-transparent" placeholder="Enterprise Holdings Inc." />
                        </div>
                        <div className="group space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#CC1414] transition-colors">Industry Vertical</label>
                          <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-lg text-slate-600 bg-transparent appearance-none cursor-pointer">
                            <option>Technology & AI</option>
                            <option>Finance & Fintech</option>
                            <option>Infrastructure & Real Estate</option>
                            <option>Private Equity</option>
                            <option>Consumer Goods</option>
                          </select>
                        </div>
                        <div className="group space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#CC1414] transition-colors">Annual Legal Spend (Estimated)</label>
                          <select value={formData.spend} onChange={e => setFormData({...formData, spend: e.target.value})} className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-lg text-slate-600 bg-transparent appearance-none cursor-pointer">
                            <option>Undisclosed</option>
                            <option>Under $1M</option>
                            <option>$1M - $5M</option>
                            <option>$5M - $20M</option>
                            <option>$20M+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-16">
                      <header>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Strategic Scope</h2>
                        <p className="text-lg text-slate-500 font-light">Define the parameters of the legal mandate.</p>
                      </header>
                      <div className="space-y-12">
                        <div className="group space-y-6">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Engagement Category *</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                            {['M&A Advisory', 'Tax Strategy', 'Dispute Resolution', 'IP Protection', 'Regulatory', 'General Counsel'].map(opt => (
                              <label key={opt} className="flex items-center space-x-4 cursor-pointer group/label p-4 border border-slate-50 hover:border-[#CC1414]/20 transition-all rounded-sm">
                                <input type="radio" name="category" checked={formData.category === opt} onChange={() => setFormData({...formData, category: opt})} className="w-5 h-5 accent-[#CC1414]" />
                                <span className="text-[16px] font-light text-slate-600 group-hover/label:text-slate-900">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="group space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#CC1414] transition-colors">Mandate Summary *</label>
                          <textarea required value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} rows={6} className="w-full border border-slate-100 p-8 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-lg text-slate-900 bg-slate-50/50 resize-none shadow-inner" placeholder="Provide a high-level summary of the required services and timeline..."></textarea>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-16">
                      <header>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Final Validation</h2>
                        <p className="text-lg text-slate-500 font-light">Upload relevant documentation (Optional) and certify the submission.</p>
                      </header>
                      <div className="space-y-10">
                        <label className={`border-2 border-dashed p-12 md:p-20 text-center rounded-sm transition-all cursor-pointer group relative overflow-hidden block ${formData.attachmentName ? 'border-[#CC1414] bg-white' : 'border-slate-200 bg-[#FDFDFD] hover:border-[#CC1414]'}`}>
                          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.xlsx" />
                          <div className={`absolute inset-0 transition-colors ${formData.attachmentName ? 'bg-[#CC1414]/5' : 'bg-transparent group-hover:bg-[#CC1414]/5'}`} />
                          
                          {formData.attachmentName ? (
                            <div className="relative z-10 flex flex-col items-center">
                               <CheckCircle className="w-16 h-16 text-[#CC1414] mb-4" />
                               <p className="text-2xl font-serif text-slate-900 mb-2">File Attached</p>
                               <p className="text-lg text-slate-600 mb-6">{formData.attachmentName}</p>
                               <button 
                                onClick={handleRemoveFile}
                                className="text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-full transition-colors"
                               >
                                 <Trash2 size={14}/> Remove Attachment
                               </button>
                            </div>
                          ) : (
                            <div className="relative z-10">
                              <FileUp className="w-16 h-16 text-slate-300 mx-auto mb-8 group-hover:text-[#CC1414] transition-colors group-hover:scale-110 duration-700" />
                              <p className="text-2xl font-serif text-slate-900 mb-3">Proprietary RFP Document</p>
                              <p className="text-[16px] text-slate-500 font-light mb-6">Click to select or drag and drop files here</p>
                              <p className="text-[11px] text-slate-400 uppercase tracking-[0.3em] border border-slate-200 inline-block px-6 py-2.5 rounded-full bg-white shadow-sm">PDF, DOCX, XLSX up to 50MB</p>
                            </div>
                          )}
                        </label>
                        <div className="bg-slate-50 p-8 md:p-10 flex items-start space-x-6 border-l-8 border-slate-900 shadow-sm">
                          <Shield className="w-8 h-8 text-slate-400 shrink-0 mt-1" />
                          <p className="text-sm md:text-[15px] text-slate-500 leading-relaxed font-light">
                            Confidentiality Notice: All information provided via this portal is protected under strict attorney-client privilege guidelines. Our systems use enterprise-grade encryption for all document transmissions to ensure absolute security for sensitive corporate data.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-16 mt-12 border-t border-slate-100 flex items-center justify-between gap-6">
                  <button
                    type="button"
                    onClick={currentStep === 1 ? onBack : handleBack}
                    className="flex items-center space-x-3 text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400 hover:text-slate-900 transition-colors py-4"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>{currentStep === 1 ? 'CANCEL' : 'BACK'}</span>
                  </button>
                  
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-12 py-5 bg-slate-900 text-white text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-[#CC1414] transition-all flex items-center space-x-4 shadow-2xl transform hover:-translate-y-1"
                    >
                      <span>NEXT STEP</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      disabled={loading}
                      type="submit"
                      className="px-14 py-6 bg-[#CC1414] text-white text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-slate-900 transition-all flex items-center space-x-5 shadow-2xl transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>TRANSMITTING...</span>
                        </>
                      ) : (
                        <>
                          <span>AUTHORIZE SUBMISSION</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Contextual Sidebar */}
          <div className="lg:col-span-4 space-y-16">
            <div className="bg-[#0A1931] text-white p-12 lg:p-14 shadow-2xl relative overflow-hidden animate-fade-in delay-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#CC1414]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase text-blue-300 mb-12 border-b border-white/10 pb-6">PARTNERSHIP VALUE</h4>
              <ul className="space-y-12">
                <li className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-sm bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#CC1414] transition-colors duration-700 shadow-inner">
                    <Clock className="w-7 h-7 text-[#CC1414] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl mb-2">Rapid Deployment</p>
                    <p className="text-[16px] text-blue-100/60 font-light leading-relaxed">Our multidisciplinary teams can mobilize for critical mandates within 24 hours of engagement approval.</p>
                  </div>
                </li>
                <li className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-sm bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#CC1414] transition-colors duration-700 shadow-inner">
                    <Award className="w-7 h-7 text-[#CC1414] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl mb-2">Tier-1 Expertise</p>
                    <p className="text-[16px] text-blue-100/60 font-light leading-relaxed">Handling mandates of national and international significance with a consistent 94% favorable outcome rate.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-12 lg:p-14 border border-slate-100 bg-white shadow-sm animate-fade-in delay-500 rounded-sm">
              <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-400 mb-10">GLOBAL ASSISTANCE</h4>
              <div className="space-y-8">
                <div>
                  <p className="text-slate-900 font-serif text-3xl mb-2">RFP Concierge</p>
                  <p className="text-[16px] text-slate-500 font-light">Global Partnership Desk</p>
                </div>
                <div className="space-y-3 pt-6">
                  <p className="text-2xl text-slate-800 font-light tracking-tight">+91 11 2345 6789</p>
                  <p className="text-[16px] text-[#CC1414] font-medium underline underline-offset-8 decoration-[#CC1414]/30 hover:decoration-[#CC1414] transition-all cursor-pointer">
                    rfp.desk@akpandey.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFPPage;
