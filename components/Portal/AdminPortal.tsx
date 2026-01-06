
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, FileText, Users, MapPin, 
  LogOut, Plus, Edit2, Trash2, 
  CheckCircle, Archive, MessageSquare, RefreshCw,
  Mic, Calendar, ImageIcon, Save, X, 
  ArrowRight, FileType, Filter, Inbox, Clock, ShieldCheck,
  Briefcase, Phone, Search, Bell, Activity, Globe, Zap,
  Sun, Moon, ChevronRight, Download, Link, ExternalLink,
  Heading1, Heading2, AlignLeft, Type, FileUp, Music, Database,
  Linkedin, MessageCircle, Mail, BookOpen, Star, Palette, List, Maximize2, Monitor,
  UserCheck, GraduationCap, Eye, Loader2, AlertTriangle, Crown, FilePlus, Receipt, CreditCard, Banknote, DollarSign, TrendingUp, AlertCircle, PenTool, Usb, Lock, KeyRound
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { contentService } from '../../services/contentService';
import { emailService } from '../../services/emailService';
import { HeroContent, Insight, Author, Inquiry, OfficeLocation, Job, JobApplication, UserProfile, ClientDocument, InvoiceDetails, InvoiceLineItem, PaymentRecord } from '../../types';
import { InvoiceRenderer } from './InvoiceRenderer';
import { InvoicePDF } from './InvoicePDF';

interface AdminPortalProps {
  onLogout: () => void;
}

type Tab = 'hero' | 'insights' | 'reports' | 'podcasts' | 'casestudy' | 'authors' | 'offices' | 'appointments' | 'rfp' | 'jobs' | 'applications' | 'clients' | 'finance';

// --- HELPER COMPONENTS ---

const SidebarLink: React.FC<{
  id: Tab;
  active: Tab;
  set: (t: Tab) => void;
  label: string;
  icon: React.ReactNode;
  isDark: boolean;
  badge?: number;
}> = ({ id, active, set, label, icon, isDark, badge }) => (
  <button
    onClick={() => set(id)}
    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl mb-1 transition-all ${
      active === id
        ? isDark ? 'bg-white/10 text-white shadow-lg' : 'bg-white text-[#CC1414] shadow-md'
        : isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-white'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={active === id ? (isDark ? 'text-[#CC1414]' : 'text-[#CC1414]') : ''}>{icon}</div>
      <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    {badge ? (
      <span className="bg-[#CC1414] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
    ) : null}
  </button>
);

const InputField: React.FC<{
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light bg-white border-slate-200 text-slate-900"
    />
  </div>
);

const FileUploader: React.FC<{
  label?: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}> = ({ label, value, onChange, icon }) => (
  <div>
    {label && <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">{label}</label>}
    <label className="flex items-center justify-center gap-3 p-4 border border-dashed border-slate-300 rounded-xl hover:border-[#CC1414] hover:bg-red-50 cursor-pointer transition-all bg-white">
      <div className="text-slate-400">{icon || <FileUp size={16} />}</div>
      <span className="text-xs uppercase tracking-widest text-slate-500">{value ? 'Change File' : 'Select File'}</span>
      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            contentService.uploadImage(file).then(onChange);
          }
        }}
        accept="image/*"
      />
    </label>
    {value && (
      <div className="mt-2 h-20 w-auto border rounded-lg overflow-hidden relative bg-slate-50 flex items-center justify-center">
        <img src={value} alt="Preview" className="max-h-full max-w-full object-contain" />
      </div>
    )}
  </div>
);

const EditorModal: React.FC<{
  entity: any;
  tab: Tab;
  onSave: () => void;
  onCancel: () => void;
  onChange: (e: any) => void;
}> = ({ entity, tab, onSave, onCancel, onChange }) => {
  if (!entity) return null;
  
  const renderFields = () => {
    return Object.keys(entity).map((key) => {
      if (['id', 'uniqueId', 'date', 'uploadedBy', 'status'].includes(key)) return null;
      if (key === 'coordinates') return null;

      // Image fields
      if (['image', 'bannerImage', 'photo'].includes(key)) {
         return (
            <div key={key} className="mb-4">
               <FileUploader 
                 label={key.replace(/([A-Z])/g, ' $1').trim()} 
                 value={entity[key]} 
                 onChange={(v) => onChange({ ...entity, [key]: v })}
                 icon={<ImageIcon size={16} />}
               />
            </div>
         );
      }
      
      // Text Areas
      if (['desc', 'bio', 'description', 'content', 'address', 'subtext'].includes(key)) {
         return (
            <div key={key} className="mb-4 space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{key}</label>
               <textarea 
                 value={entity[key]} 
                 onChange={(e) => onChange({ ...entity, [key]: e.target.value })}
                 className="w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light bg-white border-slate-200 text-slate-900 min-h-[100px]"
               />
            </div>
         );
      }
      
      // Default Input
      return (
         <div key={key} className="mb-4">
            <InputField 
               label={key.replace(/([A-Z])/g, ' $1').trim()} 
               value={entity[key]} 
               onChange={(v) => onChange({ ...entity, [key]: v })}
            />
         </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-reveal-up">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <h3 className="text-xl font-serif text-slate-900">Edit {tab.slice(0, -1).toUpperCase()}</h3>
             <button onClick={onCancel}><X size={20} className="text-slate-400 hover:text-slate-900"/></button>
          </div>
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
             {renderFields()}
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
             <button onClick={onCancel} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">Cancel</button>
             <button onClick={onSave} className="px-8 py-3 bg-[#CC1414] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-colors">Save Changes</button>
          </div>
       </div>
    </div>
  );
};

// --- DSC SIGNING MODAL SIMULATION ---
const DSCSigningModal: React.FC<{
  onClose: () => void;
  onSign: (details: any) => void;
}> = ({ onClose, onSign }) => {
  const [step, setStep] = useState<'detect' | 'select' | 'pin' | 'signing'>('detect');
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  
  // Simulated Certificates
  const certs = [
    { id: 'c1', name: 'ANAND KUMAR PANDEY', issuer: 'eMudhra Sub CA for Class 3 Individual 2014', validTo: '2026-05-20', serial: '12948102' },
    { id: 'c2', name: 'AK PANDEY & ASSOCIATES', issuer: 'Vsign CA 2014', validTo: '2025-11-15', serial: '88491022' }
  ];

  useEffect(() => {
    if (step === 'detect') {
      const timer = setTimeout(() => setStep('select'), 2500); // Simulate scanning delay
      return () => clearTimeout(timer);
    }
    if (step === 'signing') {
      const timer = setTimeout(() => {
        const cert = certs.find(c => c.id === selectedCert);
        onSign(cert);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, selectedCert]);

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-reveal-up overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Usb size={20}/></div>
             <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">DSC Token Interface</h3>
          </div>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
        </div>

        {/* Content */}
        <div className="p-8">
          
          {step === 'detect' && (
            <div className="text-center py-8">
               <Loader2 className="w-12 h-12 text-[#CC1414] animate-spin mx-auto mb-6" />
               <h4 className="text-xl font-serif text-slate-900 mb-2">Detecting Hardware Token...</h4>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Scanning for HYP2003 / ePass2003</p>
            </div>
          )}

          {step === 'select' && (
            <div className="space-y-6">
               <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">HYP2003 Token Detected</span>
               </div>
               <p className="text-sm text-slate-900 font-medium">Select a certificate to sign this invoice:</p>
               <div className="space-y-3">
                  {certs.map(cert => (
                    <button 
                      key={cert.id}
                      onClick={() => setSelectedCert(cert.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCert === cert.id ? 'border-[#CC1414] bg-[#CC1414]/5 ring-1 ring-[#CC1414]' : 'border-slate-200 hover:border-slate-400'}`}
                    >
                       <div className="flex items-start gap-3">
                          <ShieldCheck size={20} className={selectedCert === cert.id ? 'text-[#CC1414]' : 'text-slate-400'} />
                          <div>
                             <p className="font-bold text-slate-900 text-sm">{cert.name}</p>
                             <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Issued by: {cert.issuer}</p>
                             <p className="text-[10px] text-slate-400 mt-0.5">Exp: {cert.validTo}</p>
                          </div>
                       </div>
                    </button>
                  ))}
               </div>
               <button 
                 disabled={!selectedCert}
                 onClick={() => setStep('pin')}
                 className="w-full py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#CC1414] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 Proceed to PIN
               </button>
            </div>
          )}

          {step === 'pin' && (
             <div className="space-y-6">
                <div className="text-center mb-6">
                   <Lock size={40} className="mx-auto text-slate-300 mb-4" />
                   <h4 className="text-lg font-serif">Enter Token PIN</h4>
                   <p className="text-xs text-slate-400">Authorize access to the selected private key.</p>
                </div>
                <div className="relative">
                   <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                   <input 
                     type="password" 
                     autoFocus
                     value={pin}
                     onChange={e => setPin(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#CC1414] focus:outline-none text-slate-900"
                     placeholder="Token PIN"
                   />
                </div>
                <button 
                 disabled={pin.length < 4}
                 onClick={() => setStep('signing')}
                 className="w-full py-3 bg-[#CC1414] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all disabled:opacity-50"
               >
                 Sign Document
               </button>
             </div>
          )}

          {step === 'signing' && (
             <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-6" />
                <h4 className="text-xl font-serif text-slate-900 mb-2">Cryptographic Signing...</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Embedding Digital Signature</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Entities
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [premierClients, setPremierClients] = useState<UserProfile[]>([]);
  const [allInvoices, setAllInvoices] = useState<ClientDocument[]>([]);

  // Editor/Modal States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeEntity, setActiveEntity] = useState<any>(null);
  
  // Client Management States
  const [managingClient, setManagingClient] = useState<UserProfile | null>(null);
  const [clientDocs, setClientDocs] = useState<ClientDocument[]>([]);
  const [uploadDocType, setUploadDocType] = useState<'invoice' | 'document' | 'digital_invoice'>('document');
  const [docFile, setDocFile] = useState<string>('');
  const [docTitle, setDocTitle] = useState('');
  const [docAmount, setDocAmount] = useState('');
  const [invitingClient, setInvitingClient] = useState(false);
  const [creatingGlobalInvoice, setCreatingGlobalInvoice] = useState(false);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);
  
  // Invoice Viewer State
  const [viewInvoice, setViewInvoice] = useState<{data: InvoiceDetails, mode: 'invoice' | 'receipt'} | null>(null);
  const [selectedClientForInvoice, setSelectedClientForInvoice] = useState<string>('');

  // DSC State
  const [showDSCModal, setShowDSCModal] = useState(false);

  // Payment Recording State
  const [recordingPaymentFor, setRecordingPaymentFor] = useState<ClientDocument | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentRecord>({
      amountCleared: 0,
      date: new Date().toISOString().split('T')[0],
      mode: 'NEFT/RTGS',
      transactionReference: ''
  });

  // Digital Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState<InvoiceDetails>({
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    kindAttn: '',
    clientName: '',
    mailingAddress: '',
    clientAddress: '',
    items: [{ id: '1', description: 'Professional Legal Consultation', amount: 0 }],
    totalAmount: 0,
    amountInWords: '',
    signatureImage: '',
    terms: [
      "This Bill is payable by Electronic transfer/ Cheque in favor of AK Pandey & Associates.",
      "Please make payment within 15 days of receipt of this invoice.",
      "Bank Details: HDFC BANK, Account Number: XXXXXXXXXX, IFSC Code: HDFC000XXXX.",
      "Invoices are non-taxable as per the current service agreement for legal consultancy.",
      "Disputes subject to New Delhi Jurisdiction."
    ]
  });

  // --- FINANCE STATISTICS ---
  const financeStats = useMemo(() => {
    let revenue = 0;
    let pending = 0;
    allInvoices.forEach(inv => {
        const amount = inv.invoiceDetails?.totalAmount || 0;
        if (inv.status === 'Paid') revenue += amount;
        else pending += amount;
    });
    return {
        revenue,
        pending,
        count: allInvoices.length
    };
  }, [allInvoices]);

  // --- SMART INVOICE NUMBERING ---
  const getNextInvoiceNumber = (forceReset = false) => {
    const currentYear = new Date().getFullYear();
    if (forceReset) return `INV-${currentYear}-001`;

    const pattern = new RegExp(`INV-${currentYear}-(\\d+)`);
    let maxSeq = 0;

    allInvoices.forEach(inv => {
        if (inv.invoiceDetails?.invoiceNo) {
            const match = inv.invoiceDetails.invoiceNo.match(pattern);
            if (match) {
                const seq = parseInt(match[1], 10);
                if (!isNaN(seq) && seq > maxSeq) {
                    maxSeq = seq;
                }
            }
        }
    });

    return `INV-${currentYear}-${String(maxSeq + 1).padStart(3, '0')}`;
  };

  useEffect(() => {
    setLoading(true);
    const unsubs = [
      contentService.subscribeHero(setHero),
      contentService.subscribeInsights(setInsights),
      contentService.subscribeAuthors(setAuthors),
      contentService.subscribeOffices(setOffices),
      contentService.subscribeInquiries(setInquiries),
      contentService.subscribeJobs(setJobs),
      contentService.subscribeAllApplications(setApplications),
      contentService.getPremierClients(setPremierClients),
      contentService.subscribeAllInvoices(setAllInvoices)
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  useEffect(() => {
    if (loading && (hero || insights.length > 0)) setLoading(false);
  }, [hero, insights]);

  // Auto-fill address when switching to digital invoice mode inside Client Manager
  useEffect(() => {
    if (uploadDocType === 'digital_invoice' && managingClient) {
        setInvoiceForm(prev => ({
            ...prev,
            clientName: managingClient.companyName || managingClient.name,
            kindAttn: managingClient.name,
            clientAddress: managingClient.address || '',
            mailingAddress: managingClient.address || '',
            invoiceNo: getNextInvoiceNumber(),
            items: [{ id: '1', description: 'Professional Legal Consultation', amount: 0 }],
            totalAmount: 0,
            amountInWords: '',
            signatureImage: ''
        }));
    }
  }, [uploadDocType, managingClient]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleEdit = (entity: any, tab?: Tab) => {
    if (tab) setActiveTab(tab);
    if (!entity) return; 
    setActiveEntity({ ...entity });
    setIsEditing(true);
  };

  const handleNew = () => {
    if (activeTab === 'clients') {
       setInvitingClient(true);
       setActiveEntity({ name: '', email: '', mobile: '', companyName: '', address: '', password: '' });
       setIsEditing(true);
       return;
    }
    if (activeTab === 'finance') {
        setCreatingGlobalInvoice(true);
        setInvoiceForm(prev => ({
            ...prev,
            invoiceNo: getNextInvoiceNumber(),
            clientName: '',
            kindAttn: '',
            clientAddress: '',
            mailingAddress: '',
            items: [{ id: '1', description: 'Professional Legal Consultation', amount: 0 }],
            totalAmount: 0,
            amountInWords: '',
            signatureImage: ''
        }));
        setSelectedClientForInvoice('');
        return;
    }

    const templates: Record<string, any> = {
      hero: { ...hero },
      insights: { type: 'insights', title: '', category: 'LEGAL UPDATE', desc: '', content: '', image: '', bannerImage: '', isFeatured: false, showInHero: false },
      reports: { type: 'reports', title: '', category: 'ANNUAL REPORT', desc: '', pdfUrl: '', image: '', bannerImage: '', isFeatured: false, showInHero: false },
      podcasts: { type: 'podcasts', title: '', category: 'LEGAL PODCAST', desc: '', audioUrl: '', season: '1', episode: '1', image: '', bannerImage: '', isFeatured: false, showInHero: false },
      casestudy: { type: 'casestudy', title: '', category: 'MANDATE OUTCOME', desc: '', content: '', image: '', bannerImage: '', isFeatured: false, showInHero: false },
      authors: { name: '', title: 'Counsel', bio: '', linkedin: '', whatsapp: '', email: '', qualifications: '', image: '' },
      offices: { city: '', address: '', phone: '', email: '', coordinates: { lat: 28.61, lng: 77.20 }, image: '' },
      jobs: { title: '', department: 'Litigation', location: 'New Delhi', description: '', status: 'active' }
    };
    setActiveEntity(templates[activeTab]);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        if (invitingClient) {
           await contentService.createPremierUser(activeEntity);
           await emailService.sendPremierInvitation(activeEntity);
           setInvitingClient(false);
        } else if (activeTab === 'hero') await contentService.saveHero(activeEntity);
        else if (['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab)) await contentService.saveInsight(activeEntity);
        else if (activeTab === 'authors') await contentService.saveAuthor(activeEntity);
        else if (activeTab === 'offices') await contentService.saveOffice(activeEntity);
        else if (activeTab === 'jobs') await contentService.saveJob(activeEntity);
        
        setIsEditing(false);
        setActiveEntity(null);
    } catch (err: any) {
        alert(`Failed to save: ${err.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm data erasure?")) return;
    if (['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab)) contentService.deleteInsight(id);
    else if (activeTab === 'authors') contentService.deleteAuthor(id);
    else if (activeTab === 'offices') contentService.deleteOffice(id);
    else if (activeTab === 'jobs') contentService.deleteJob(id);
  };

  const openClientManager = (client: UserProfile) => {
     setManagingClient(client);
     contentService.subscribeClientDocuments(client.uid, setClientDocs);
     setInvoiceForm(prev => ({
        ...prev,
        clientName: client.companyName || client.name,
        kindAttn: client.name,
        clientAddress: client.address || '',
        mailingAddress: client.address || '',
        invoiceNo: getNextInvoiceNumber(),
        signatureImage: ''
     }));
  };

  const handleClientSelect = (clientId: string) => {
      setSelectedClientForInvoice(clientId);
      const client = premierClients.find(c => c.uid === clientId);
      if (client) {
          setInvoiceForm(prev => ({
              ...prev,
              clientName: client.companyName || client.name,
              kindAttn: client.name,
              clientAddress: client.address || '',
              mailingAddress: client.address || ''
          }));
      }
  };

  const handleCreateDigitalInvoice = async () => {
     const targetClientId = creatingGlobalInvoice ? selectedClientForInvoice : managingClient?.uid;
     if (!targetClientId) {
         alert("Please select a client.");
         return;
     }

     const targetClient = creatingGlobalInvoice 
        ? premierClients.find(c => c.uid === targetClientId)
        : managingClient;

     if (!targetClient) {
        alert("Client identification failed for email notification.");
        return; 
     }

     setIsSaving(true);
     const total = invoiceForm.items.reduce((sum, item) => sum + Number(item.amount), 0);
     const amountWords = `${total} ONLY`; 
     const finalInvoice: InvoiceDetails = {
        ...invoiceForm,
        totalAmount: total,
        amountInWords: amountWords.toUpperCase()
     };
     
     await contentService.addClientDocument({
        userId: targetClientId,
        type: 'invoice',
        title: `Invoice #${finalInvoice.invoiceNo}`,
        url: '', 
        uploadedBy: 'admin',
        date: invoiceForm.date,
        status: 'Pending',
        amount: `₹${total.toLocaleString()}`,
        invoiceDetails: finalInvoice
     });

     try {
        const blob = await pdf(<InvoicePDF data={finalInvoice} type="invoice" />).toBlob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            const base64data = reader.result?.toString().split(',')[1];
            await emailService.sendInvoiceNotification(targetClient, finalInvoice, base64data);
        };
     } catch (e) {
        console.error("Failed to generate or send invoice email", e);
     }

     setIsSaving(false);
     setUploadDocType('document');
     setCreatingGlobalInvoice(false);
  };

  const handleSendInvoiceEmail = async (inv: ClientDocument) => {
      if(!inv.invoiceDetails || !inv.userId) return;
      setSendingMailId(inv.id);
      
      const targetClient = premierClients.find(c => c.uid === inv.userId);
      if(!targetClient) {
          alert("Client information not found.");
          setSendingMailId(null);
          return;
      }

      try {
          const blob = await pdf(<InvoicePDF data={inv.invoiceDetails} type="invoice" />).toBlob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
              const base64data = reader.result?.toString().split(',')[1];
              await emailService.sendInvoiceNotification(targetClient, inv.invoiceDetails, base64data);
              setSendingMailId(null);
              alert("Invoice sent to client email.");
          };
      } catch(e) {
          console.error("Email send failed", e);
          setSendingMailId(null);
          alert("Failed to send email.");
      }
  };

  const initiatePaymentRecord = (doc: ClientDocument) => {
      if(!doc.invoiceDetails) return;
      setRecordingPaymentFor(doc);
      setPaymentForm({
          amountCleared: doc.invoiceDetails.totalAmount,
          date: new Date().toISOString().split('T')[0],
          mode: 'NEFT/RTGS',
          transactionReference: ''
      });
  };

  const confirmPayment = async () => {
      if(!recordingPaymentFor || !paymentForm.amountCleared) return;
      
      setIsSaving(true);
      await contentService.updateDocumentStatus(recordingPaymentFor.id, 'Paid', paymentForm);

      const targetClient = premierClients.find(c => c.uid === recordingPaymentFor.userId);
      
      if (targetClient && recordingPaymentFor.invoiceDetails) {
          const updatedInvoiceDetails: InvoiceDetails = {
              ...recordingPaymentFor.invoiceDetails,
              payment: paymentForm
          };

          try {
              const blob = await pdf(<InvoicePDF data={updatedInvoiceDetails} type="receipt" />).toBlob();
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = async () => {
                  const base64data = reader.result?.toString().split(',')[1];
                  await emailService.sendReceiptNotification(targetClient, updatedInvoiceDetails, base64data);
              };
          } catch (error) {
              console.error("Failed to send receipt email:", error);
          }
      }

      setIsSaving(false);
      setRecordingPaymentFor(null);
  };

  const updateInvoiceItem = (idx: number, field: keyof InvoiceLineItem, value: any) => {
     const newItems = [...invoiceForm.items];
     newItems[idx] = { ...newItems[idx], [field]: value };
     setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const addInvoiceItem = () => {
     setInvoiceForm({
        ...invoiceForm,
        items: [...invoiceForm.items, { id: Date.now().toString(), description: '', amount: 0 }]
     });
  };

  const removeInvoiceItem = (idx: number) => {
     const newItems = invoiceForm.items.filter((_, i) => i !== idx);
     setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const handleUploadClientDoc = async () => {
     if (!managingClient || !docFile || !docTitle) return;
     setIsSaving(true);
     await contentService.addClientDocument({
        userId: managingClient.uid,
        type: uploadDocType === 'invoice' ? 'invoice' : 'brief',
        title: docTitle,
        url: docFile,
        uploadedBy: 'admin',
        date: new Date().toISOString(),
        status: uploadDocType === 'invoice' ? 'Pending' : undefined,
        amount: uploadDocType === 'invoice' ? docAmount : undefined
     });
     setIsSaving(false);
     setDocFile(''); setDocTitle(''); setDocAmount('');
  };

  const handleAssignAdvocate = async (advocate: Author) => {
     if (!managingClient) return;
     await contentService.updateClientProfile(managingClient.uid, {
        assignedAdvocate: {
           name: advocate.name,
           email: advocate.email || '',
           phone: '+91 99999 00000', 
           designation: advocate.title,
           photo: advocate.image
        }
     });
     setManagingClient(prev => prev ? ({...prev, assignedAdvocate: { name: advocate.name, email: advocate.email || '', phone: '+91 99999 00000', designation: advocate.title, photo: advocate.image }}) : null);
  };

  // --- DSC HANDLER ---
  const handleDSCSign = (cert: any) => {
    // When a cert is selected from the modal
    setInvoiceForm({
        ...invoiceForm,
        digitalSignature: {
            signatoryName: cert.name,
            issuer: cert.issuer,
            serialNumber: cert.serial,
            timestamp: new Date().toISOString(),
            tokenDevice: 'HYP2003',
            validUntil: cert.validTo
        },
        signatureImage: '' // Clear manual image if digital signature is applied
    });
    setShowDSCModal(false);
  };

  const renderPaymentModal = () => (
      <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-reveal-up shadow-2xl">
              <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-center">
                  <div>
                      <h3 className="text-xl font-serif text-slate-900 mb-1">Record Payment</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">{recordingPaymentFor?.title}</p>
                  </div>
                  <button onClick={() => setRecordingPaymentFor(null)} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                  <InputField 
                    label="Amount Cleared (INR)" 
                    type="number"
                    value={paymentForm.amountCleared} 
                    onChange={(v: any) => setPaymentForm({...paymentForm, amountCleared: Number(v)})} 
                  />
                  <div className="grid grid-cols-2 gap-6">
                      <InputField 
                        label="Payment Date" 
                        type="date"
                        value={paymentForm.date} 
                        onChange={(v: string) => setPaymentForm({...paymentForm, date: v})} 
                      />
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            Mode
                        </label>
                        <select 
                            value={paymentForm.mode}
                            onChange={(e: any) => setPaymentForm({...paymentForm, mode: e.target.value})}
                            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light bg-white border-slate-200 text-slate-900"
                        >
                            <option>NEFT/RTGS</option>
                            <option>Cheque</option>
                            <option>UPI</option>
                            <option>Wire Transfer</option>
                            <option>Cash</option>
                        </select>
                      </div>
                  </div>
                  <InputField 
                    label="Transaction Reference / Cheque No." 
                    value={paymentForm.transactionReference} 
                    onChange={(v: string) => setPaymentForm({...paymentForm, transactionReference: v})} 
                    placeholder="e.g. UTR-12345678"
                  />
              </div>
              <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
                  <button onClick={() => setRecordingPaymentFor(null)} className="px-6 py-3 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-900">Cancel</button>
                  <button 
                    onClick={confirmPayment}
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#CC1414] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all flex items-center gap-2"
                  >
                      {isSaving ? <Loader2 className="animate-spin" size={14}/> : <CheckCircle size={14}/>} Confirm Payment
                  </button>
              </div>
          </div>
      </div>
  );

  const renderDigitalInvoiceForm = () => (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
        {creatingGlobalInvoice && (
            <div className="mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Select Client</label>
                <select 
                    value={selectedClientForInvoice}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full p-3 border rounded-xl text-sm bg-white"
                >
                    <option value="">-- Choose Client --</option>
                    {premierClients.map(c => (
                        <option key={c.uid} value={c.uid}>{c.name} ({c.companyName || 'Ind.'})</option>
                    ))}
                </select>
            </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
            <div>
               <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Invoice No</label>
                  <button onClick={() => setInvoiceForm(prev => ({...prev, invoiceNo: getNextInvoiceNumber(true)}))} className="text-[9px] font-bold text-blue-600 hover:text-blue-800 uppercase flex items-center gap-1"><RefreshCw size={10}/> Reset FY</button>
               </div>
               <input value={invoiceForm.invoiceNo} onChange={e => setInvoiceForm({...invoiceForm, invoiceNo: e.target.value})} placeholder="Invoice No" className="w-full p-3 border rounded-xl text-sm" />
            </div>
            <div>
               <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Date</label>
               <input type="date" value={invoiceForm.date} onChange={e => setInvoiceForm({...invoiceForm, date: e.target.value})} className="w-full p-3 border rounded-xl text-sm" />
            </div>
        </div>
        <input value={invoiceForm.kindAttn} onChange={e => setInvoiceForm({...invoiceForm, kindAttn: e.target.value})} placeholder="Kind Attn" className="w-full p-3 border rounded-xl text-sm" />
        <textarea value={invoiceForm.clientAddress} onChange={e => setInvoiceForm({...invoiceForm, clientAddress: e.target.value})} placeholder="Client Address" className="w-full p-3 border rounded-xl text-sm h-20" />
        <textarea value={invoiceForm.mailingAddress} onChange={e => setInvoiceForm({...invoiceForm, mailingAddress: e.target.value})} placeholder="Mailing Address" className="w-full p-3 border rounded-xl text-sm h-20" />
        
        <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase">Line Items</p>
            {invoiceForm.items.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-start">
                <textarea 
                  value={item.description} 
                  onChange={e => updateInvoiceItem(idx, 'description', e.target.value)} 
                  placeholder="Item Desc" 
                  className="flex-1 p-2 border rounded-lg text-sm h-20 resize-y" 
                />
                <input type="number" value={item.amount} onChange={e => updateInvoiceItem(idx, 'amount', e.target.value)} placeholder="Amount" className="w-24 p-2 border rounded-lg text-sm h-10" />
                <button onClick={() => removeInvoiceItem(idx)} className="text-red-500 p-2"><Trash2 size={16}/></button>
                </div>
            ))}
            <button onClick={addInvoiceItem} className="text-[10px] font-bold uppercase text-blue-600 flex items-center gap-1"><Plus size={12}/> Add Item</button>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200">
           <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold uppercase">Authorized Signatory</p>
              {invoiceForm.digitalSignature && (
                 <button onClick={() => setInvoiceForm({...invoiceForm, digitalSignature: undefined})} className="text-[9px] text-red-500 uppercase font-bold hover:underline">Remove Digital Signature</button>
              )}
           </div>
           
           {invoiceForm.digitalSignature ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                 <ShieldCheck className="text-green-600 mt-1" size={24}/>
                 <div>
                    <p className="text-sm font-bold text-green-800">Digitally Signed</p>
                    <p className="text-xs text-green-700">{invoiceForm.digitalSignature.signatoryName}</p>
                    <p className="text-[10px] text-green-600 mt-1">Token: {invoiceForm.digitalSignature.tokenDevice} • {new Date(invoiceForm.digitalSignature.timestamp).toLocaleString()}</p>
                 </div>
              </div>
           ) : (
              <div className="flex gap-4">
                 <button 
                    onClick={() => setShowDSCModal(true)}
                    className="flex-1 py-3 border border-slate-300 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                 >
                    <Usb size={16}/>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Sign with DSC</span>
                 </button>
                 <div className="flex-1">
                    <FileUploader 
                       value={invoiceForm.signatureImage || ''} 
                       onChange={(v: string) => setInvoiceForm({...invoiceForm, signatureImage: v})} 
                       icon={<PenTool size={16}/>} 
                       label=""
                    />
                 </div>
              </div>
           )}
        </div>

        <button onClick={handleCreateDigitalInvoice} disabled={isSaving} className="w-full py-3 bg-[#CC1414] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2">
            {isSaving ? <Loader2 className="animate-spin" size={16}/> : <CreditCard size={16}/>} Generate Invoice
        </button>
    </div>
  );

  const renderFinanceTable = () => (
    <div className="space-y-8">
        {/* Finance Stats */}
        <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24}/></div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Revenue</p>
                    <p className="text-2xl font-serif font-bold text-slate-900">₹{financeStats.revenue.toLocaleString()}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock size={24}/></div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pending Receivables</p>
                    <p className="text-2xl font-serif font-bold text-slate-900">₹{financeStats.pending.toLocaleString()}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Receipt size={24}/></div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Invoices</p>
                    <p className="text-2xl font-serif font-bold text-slate-900">{financeStats.count}</p>
                </div>
            </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                    <th className="p-6">Invoice #</th>
                    <th className="p-6">Date</th>
                    <th className="p-6">Client</th>
                    <th className="p-6 text-right">Amount</th>
                    <th className="p-6 text-center">Status</th>
                    <th className="p-6 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {allInvoices.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">No invoices found.</td></tr>
                ) : (
                    allInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-6 text-sm font-bold text-slate-700">{inv.title.replace('Invoice ', '')}</td>
                        <td className="p-6 text-sm text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                        <td className="p-6 text-sm text-slate-700">
                            {inv.invoiceDetails?.clientName || 'Unknown'}
                        </td>
                        <td className="p-6 text-sm font-bold text-right text-slate-900">{inv.amount}</td>
                        <td className="p-6 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {inv.status}
                            </span>
                        </td>
                        <td className="p-6 text-right flex justify-end gap-2">
                            <button 
                                onClick={() => handleSendInvoiceEmail(inv)}
                                className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-200 text-[10px] font-bold uppercase flex items-center gap-1"
                                title="Send Email"
                            >
                                {sendingMailId === inv.id ? <Loader2 size={14} className="animate-spin"/> : <Mail size={14}/>}
                            </button>

                            {inv.status !== 'Paid' && (
                                <button onClick={() => initiatePaymentRecord(inv)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-[10px] font-bold uppercase flex items-center gap-1">
                                    <Banknote size={14}/> Record Pay
                                </button>
                            )}
                            <button onClick={() => setViewInvoice({data: inv.invoiceDetails!, mode: 'invoice'})} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-[10px] font-bold uppercase flex items-center gap-1">
                                <Eye size={14}/> View
                            </button>
                            {inv.status === 'Paid' && (
                                <button onClick={() => setViewInvoice({data: inv.invoiceDetails!, mode: 'receipt'})} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-[10px] font-bold uppercase flex items-center gap-1">
                                    <Receipt size={14}/> Receipt
                                </button>
                            )}
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
        </table>
        </div>
    </div>
  );

  const renderApplicationsTable = () => (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                <th className="p-6">Date</th>
                <th className="p-6">Candidate</th>
                <th className="p-6">Role</th>
                <th className="p-6 text-center">Resume</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
            {applications.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">No applications found.</td></tr>
            ) : (
                applications.map(app => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 text-sm text-slate-500">{new Date(app.submittedDate).toLocaleDateString()}</td>
                    <td className="p-6">
                        <p className="text-sm font-bold text-slate-900">{app.data.personal.name}</p>
                        <p className="text-xs text-slate-400">{app.data.personal.email}</p>
                    </td>
                    <td className="p-6 text-sm text-slate-700">{app.jobTitle}</td>
                    <td className="p-6 text-center">
                        {app.data.resumeUrl && app.data.resumeUrl !== 'Not Attached' ? (
                            <span className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">Attached</span>
                        ) : <span className="text-xs text-slate-300">N/A</span>}
                    </td>
                    <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            app.status === 'Received' ? 'bg-blue-50 text-blue-600' : 
                            app.status === 'Under Review' ? 'bg-orange-50 text-orange-600' : 
                            app.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                            'bg-green-50 text-green-600'
                        }`}>
                            {app.status}
                        </span>
                    </td>
                    <td className="p-6 text-right">
                        <select 
                            value={app.status}
                            onChange={(e) => contentService.updateApplicationStatus(app.id, e.target.value as any)}
                            className="p-2 border rounded text-xs bg-white"
                        >
                            <option>Received</option>
                            <option>Under Review</option>
                            <option>Interview</option>
                            <option>Offered</option>
                            <option>Rejected</option>
                        </select>
                    </td>
                </tr>
                ))
            )}
        </tbody>
      </table>
    </div>
  );

  const renderInquiriesTable = (type: 'appointment' | 'rfp') => {
      const filtered = inquiries.filter(i => i.type === type);
      return (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                        <th className="p-6">ID / Date</th>
                        <th className="p-6">Contact</th>
                        <th className="p-6">Details</th>
                        <th className="p-6 text-center">Status</th>
                        <th className="p-6 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filtered.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">No records found.</td></tr>
                    ) : (
                        filtered.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-6">
                                <p className="text-xs font-bold text-slate-900">{item.uniqueId}</p>
                                <p className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</p>
                            </td>
                            <td className="p-6">
                                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                <p className="text-xs text-slate-400">{item.email}</p>
                            </td>
                            <td className="p-6 text-sm text-slate-600">
                                {type === 'appointment' ? (
                                    <>
                                        <p><span className="font-bold">Branch:</span> {item.details.branch}</p>
                                        <p><span className="font-bold">Time:</span> {item.details.time.hour}:{item.details.time.minute} {item.details.time.period}</p>
                                    </>
                                ) : (
                                    <>
                                        <p><span className="font-bold">Org:</span> {item.details.organization}</p>
                                        <p><span className="font-bold">Category:</span> {item.details.category}</p>
                                    </>
                                )}
                            </td>
                            <td className="p-6 text-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status === 'new' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-6 text-right">
                                {item.status === 'new' && (
                                    <button 
                                        onClick={() => contentService.updateInquiryStatus(item.id, 'reviewed')}
                                        className="text-[10px] font-bold uppercase text-blue-600 hover:text-blue-800"
                                    >
                                        Mark Reviewed
                                    </button>
                                )}
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      );
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#0A0B0E]' : 'bg-[#F4F7FE]'}`}>
      {viewInvoice && <InvoiceRenderer data={viewInvoice.data} mode={viewInvoice.mode} onClose={() => setViewInvoice(null)} />}
      {recordingPaymentFor && renderPaymentModal()}
      {showDSCModal && <DSCSigningModal onClose={() => setShowDSCModal(false)} onSign={handleDSCSign} />}
      
      {isEditing && (
        <EditorModal 
          entity={activeEntity} 
          tab={activeTab} 
          onSave={handleSave} 
          onCancel={() => { setIsEditing(false); setActiveEntity(null); setInvitingClient(false); setCreatingGlobalInvoice(false); }} 
          onChange={(newEntity) => setActiveEntity(newEntity)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[290px] flex flex-col h-full shrink-0 border-r ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 bg-[#CC1414] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-500/20"><ShieldCheck size={28}/></div>
             <span className={`text-[18px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AKP ADMIN</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Chamber Strategy</div>
          <SidebarLink id="hero" active={activeTab} set={setActiveTab} label="Hero Banners" icon={<Database size={18} />} isDark={isDarkMode} />
          <SidebarLink id="insights" active={activeTab} set={setActiveTab} label="Legal Insights" icon={<FileText size={18} />} isDark={isDarkMode} />
          <SidebarLink id="reports" active={activeTab} set={setActiveTab} label="Annual Reports" icon={<BookOpen size={18} />} isDark={isDarkMode} />
          
          <div className="px-4 py-2 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Organization</div>
          <SidebarLink id="clients" active={activeTab} set={setActiveTab} label="Client Matrix" icon={<Crown size={18} />} isDark={isDarkMode} badge={premierClients.length} />
          <SidebarLink id="finance" active={activeTab} set={setActiveTab} label="Finance" icon={<Receipt size={18} />} isDark={isDarkMode} />
          <SidebarLink id="authors" active={activeTab} set={setActiveTab} label="Managing Authors" icon={<Users size={18} />} isDark={isDarkMode} />
          <SidebarLink id="jobs" active={activeTab} set={setActiveTab} label="Recruitment" icon={<Briefcase size={18} />} isDark={isDarkMode} />
          <SidebarLink id="applications" active={activeTab} set={setActiveTab} label="Talent Pool" icon={<UserCheck size={18} />} isDark={isDarkMode} badge={applications.filter(a => a.status === 'Received').length} />
          
          <div className="px-4 py-2 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Communications</div>
          <SidebarLink id="appointments" active={activeTab} set={setActiveTab} label="Appointments" icon={<Calendar size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type === 'appointment' && i.status === 'new').length} />
          <SidebarLink id="rfp" active={activeTab} set={setActiveTab} label="Mandate Inbox" icon={<Inbox size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type !== 'appointment' && i.status === 'new').length} />
          <SidebarLink id="offices" active={activeTab} set={setActiveTab} label="Locations" icon={<MapPin size={18} />} isDark={isDarkMode} />
        </nav>
        <div className="p-4 mt-auto border-t border-white/5 space-y-2">
          <button onClick={toggleDarkMode} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">
            {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>} Protocol
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#CC1414] hover:bg-red-50 transition-colors">
            <LogOut size={18} /> Exit Matrix
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-12 py-12 custom-scrollbar relative">
        <div className="flex justify-between items-center mb-16 animate-reveal-up">
           <div>
              <h2 className={`text-4xl font-serif mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeTab === 'applications' ? 'Talent Acquisition' : activeTab === 'rfp' ? 'Mandate Inbox' : activeTab === 'clients' ? 'Premier Client Matrix' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
           </div>
           
           {['hero', 'insights', 'reports', 'podcasts', 'authors', 'offices', 'jobs', 'clients', 'finance'].includes(activeTab) && (
             <button 
              onClick={activeTab === 'hero' ? () => handleEdit(hero) : handleNew}
              className="px-10 py-5 bg-[#CC1414] text-white text-[11px] font-bold tracking-[0.3em] uppercase rounded-full hover:scale-105 transition-all shadow-xl shadow-red-500/20 flex items-center gap-3"
             >
               {activeTab === 'hero' ? <Edit2 size={18}/> : <Plus size={18}/>}
               {activeTab === 'hero' ? 'Update Banner' : activeTab === 'clients' ? 'Add Client' : activeTab === 'finance' ? 'Create Invoice' : 'Add Entity'}
             </button>
           )}
        </div>

        {/* ... (Existing List Rendering Logic Remains Unchanged) ... */}
        
        {/* Creating Global Invoice Mode */}
        {creatingGlobalInvoice && activeTab === 'finance' ? (
           <div className="max-w-4xl mx-auto animate-reveal-up">
              <div className="flex items-center gap-4 mb-8">
                 <button onClick={() => setCreatingGlobalInvoice(false)} className="p-2 hover:bg-slate-200 rounded-full"><X/></button>
                 <h3 className="text-2xl font-serif text-slate-900">New Global Invoice</h3>
              </div>
              {renderDigitalInvoiceForm()}
           </div>
        ) : (
           <>
             {activeTab === 'finance' && renderFinanceTable()}
             {activeTab === 'applications' && renderApplicationsTable()}
             {activeTab === 'appointments' && renderInquiriesTable('appointment')}
             {activeTab === 'rfp' && renderInquiriesTable('rfp')}

             {/* Standard Entity Grid Code (Hero, Insights, Authors, etc.) */}
             {['hero', 'insights', 'reports', 'podcasts', 'authors', 'offices', 'jobs'].includes(activeTab) && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-reveal-up">
                  {/* ... (Existing Standard Card Rendering) ... */}
                  {/* HERO */}
                  {activeTab === 'hero' && hero && (
                     <div className="col-span-3 p-10 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <div className="aspect-[21/9] bg-slate-100 rounded-xl overflow-hidden mb-8 relative">
                           <img src={hero.backgroundImage} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <h3 className="text-4xl text-white font-serif">{hero.headline}</h3>
                           </div>
                        </div>
                        <div className="flex justify-between items-center">
                           <p className="text-slate-500">{hero.subtext}</p>
                           <button onClick={() => handleEdit(hero)} className="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-full">Edit Content</button>
                        </div>
                     </div>
                  )}

                  {/* INSIGHTS & REPORTS */}
                  {['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab) && insights.filter(i => i.type === activeTab).map(item => (
                     <div key={item.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                        <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden mb-6 relative">
                           <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           {item.isFeatured && <span className="absolute top-4 left-4 bg-[#CC1414] text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase">Featured</span>}
                        </div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">{item.category}</p>
                        <h3 className="text-lg font-serif text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-slate-500 mb-6 line-clamp-2">{item.desc}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                           <button onClick={() => handleEdit(item)} className="text-[10px] font-bold uppercase text-slate-900 hover:text-[#CC1414]">Edit</button>
                           <button onClick={() => handleDelete(item.id)} className="text-[10px] font-bold uppercase text-slate-400 hover:text-red-600">Remove</button>
                        </div>
                     </div>
                  ))}

                  {/* AUTHORS */}
                  {activeTab === 'authors' && authors.map(author => (
                     <div key={author.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all text-center">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-6 border-2 border-slate-50">
                           <img src={author.image} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg font-serif text-slate-900">{author.name}</h3>
                        <p className="text-xs font-bold uppercase text-slate-400 mb-4">{author.title}</p>
                        <div className="flex justify-center gap-4">
                           <button onClick={() => handleEdit(author)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-200"><Edit2 size={14}/></button>
                           <button onClick={() => handleDelete(author.id)} className="p-2 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-600"><Trash2 size={14}/></button>
                        </div>
                     </div>
                  ))}

                  {/* OFFICES */}
                  {activeTab === 'offices' && offices.map(office => (
                     <div key={office.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all">
                        <div className="h-32 bg-slate-100 rounded-xl overflow-hidden mb-6">
                           <img src={office.image} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-serif text-slate-900 mb-2">{office.city}</h3>
                        <p className="text-xs text-slate-500 mb-6">{office.address}</p>
                        <div className="flex justify-end gap-4">
                           <button onClick={() => handleEdit(office)} className="text-[10px] font-bold uppercase text-slate-900 hover:text-[#CC1414]">Edit</button>
                           <button onClick={() => handleDelete(office.id)} className="text-[10px] font-bold uppercase text-slate-400 hover:text-red-600">Remove</button>
                        </div>
                     </div>
                  ))}

                  {/* JOBS */}
                  {activeTab === 'jobs' && jobs.map(job => (
                     <div key={job.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <span className="px-3 py-1 bg-slate-50 text-[9px] font-bold uppercase rounded-full text-slate-500">{job.department}</span>
                           <span className={`w-2 h-2 rounded-full ${job.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <h3 className="text-lg font-serif text-slate-900 mb-2">{job.title}</h3>
                        <p className="text-xs text-slate-500 mb-6 line-clamp-2">{job.description}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                           <button onClick={() => handleEdit(job)} className="text-[10px] font-bold uppercase text-slate-900 hover:text-[#CC1414]">Edit</button>
                           <button onClick={() => handleDelete(job.id)} className="text-[10px] font-bold uppercase text-slate-400 hover:text-red-600">Remove</button>
                        </div>
                     </div>
                  ))}
               </div>
             )}

             {/* CLIENT MATRIX VIEW */}
             {activeTab === 'clients' && !managingClient && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-reveal-up">
                   {premierClients.map(client => (
                      <div key={client.uid} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#CC1414]/10 transition-colors" />
                         <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl font-bold font-serif text-lg">
                               {client.companyName ? client.companyName.charAt(0) : client.name.charAt(0)}
                            </div>
                            <button onClick={() => openClientManager(client)} className="p-2 bg-slate-50 rounded-full hover:bg-[#CC1414] hover:text-white transition-colors">
                               <ArrowRight size={16}/>
                            </button>
                         </div>
                         <h3 className="text-xl font-serif text-slate-900 mb-1">{client.companyName || 'Private Client'}</h3>
                         <p className="text-sm text-slate-500 mb-6 font-light">{client.name}</p>
                         <div className="space-y-3 pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-slate-400 text-xs"><Mail size={14}/> {client.email}</div>
                            <div className="flex items-center gap-3 text-slate-400 text-xs"><Phone size={14}/> {client.mobile}</div>
                         </div>
                      </div>
                   ))}
                </div>
             )}

             {/* INDIVIDUAL CLIENT MANAGER */}
             {activeTab === 'clients' && managingClient && (
                <div className="animate-reveal-up">
                   <button onClick={() => setManagingClient(null)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 mb-8">
                      <ChevronRight className="rotate-180" size={16}/> Back to Matrix
                   </button>
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                      <div className="lg:col-span-4 space-y-8">
                         <div className="p-10 bg-white border border-slate-100 rounded-3xl text-center">
                            <div className="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center text-3xl font-serif mx-auto mb-6">
                               {managingClient.companyName ? managingClient.companyName.charAt(0) : managingClient.name.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-serif text-slate-900">{managingClient.name}</h2>
                            <p className="text-xs font-bold uppercase text-slate-400 mt-2">{managingClient.companyName}</p>
                            <div className="mt-8 space-y-4 text-left">
                               <p className="text-xs text-slate-500 flex items-center gap-3"><Mail size={14}/> {managingClient.email}</p>
                               <p className="text-xs text-slate-500 flex items-center gap-3"><MapPin size={14}/> {managingClient.address || 'No Address'}</p>
                            </div>
                         </div>
                         <div className="p-8 bg-slate-900 text-white rounded-3xl">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Assigned Counsel</h4>
                            {managingClient.assignedAdvocate ? (
                               <div className="flex items-center gap-4">
                                  <img src={managingClient.assignedAdvocate.photo} className="w-12 h-12 rounded-full object-cover border border-white/20"/>
                                  <div>
                                     <p className="font-serif text-lg">{managingClient.assignedAdvocate.name}</p>
                                     <p className="text-[10px] uppercase text-slate-400">{managingClient.assignedAdvocate.designation}</p>
                                  </div>
                               </div>
                            ) : (
                               <div>
                                  <p className="text-xs text-slate-400 italic mb-4">No counsel assigned.</p>
                                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                     {authors.map(author => (
                                        <button key={author.id} onClick={() => handleAssignAdvocate(author)} className="w-full text-left p-2 hover:bg-white/10 rounded-lg text-xs flex items-center gap-3">
                                           <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden"><img src={author.image} className="w-full h-full object-cover"/></div>
                                           {author.name}
                                        </button>
                                     ))}
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                      <div className="lg:col-span-8 space-y-8">
                         <div className="p-8 bg-white border border-slate-100 rounded-3xl">
                            <div className="flex gap-4 mb-6">
                               <button 
                                 onClick={() => setUploadDocType('document')}
                                 className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${uploadDocType === 'document' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                               >
                                  Upload Document
                               </button>
                               <button 
                                 onClick={() => setUploadDocType('digital_invoice')}
                                 className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${uploadDocType === 'digital_invoice' ? 'bg-[#CC1414] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                               >
                                  Create Digital Invoice
                               </button>
                            </div>
                            {uploadDocType === 'digital_invoice' ? (
                               renderDigitalInvoiceForm()
                            ) : (
                               <div className="flex gap-4 items-end">
                                  <div className="flex-1 space-y-2">
                                     <label className="text-[10px] font-bold uppercase text-slate-400">Document Title</label>
                                     <input value={docTitle} onChange={e => setDocTitle(e.target.value)} className="w-full p-3 border rounded-xl text-sm" placeholder="e.g. Case Brief 2025" />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                     <label className="text-[10px] font-bold uppercase text-slate-400">File Attachment</label>
                                     <FileUploader value={docFile} onChange={setDocFile} icon={<FileText size={16}/>} />
                                  </div>
                                  <button onClick={handleUploadClientDoc} disabled={isSaving || !docFile} className="h-[50px] px-6 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#CC1414] transition-colors disabled:opacity-50">Upload</button>
                               </div>
                            )}
                         </div>
                         <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Client Vault</h4>
                            {clientDocs.length === 0 ? (
                               <div className="p-12 border-2 border-dashed border-slate-100 rounded-3xl text-center text-slate-400 italic">Empty Vault</div>
                            ) : (
                               clientDocs.map(doc => (
                                  <div key={doc.id} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-lg transition-all">
                                     <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.type === 'invoice' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                           {doc.type === 'invoice' ? <Receipt size={20}/> : <FileText size={20}/>}
                                        </div>
                                        <div>
                                           <h4 className="font-serif text-slate-900">{doc.title}</h4>
                                           <p className="text-[10px] uppercase text-slate-400">{new Date(doc.date).toLocaleDateString()} • {doc.status || 'Archived'}</p>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-3">
                                        {doc.type === 'invoice' && doc.status !== 'Paid' && (
                                            <button onClick={() => initiatePaymentRecord(doc)} className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100" title="Record Payment"><Banknote size={16}/></button>
                                        )}
                                        {doc.type === 'invoice' && (
                                            <>
                                               <button onClick={() => handleSendInvoiceEmail(doc)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-lg" title="Email Invoice"><Mail size={16}/></button>
                                               {doc.invoiceDetails && <button onClick={() => setViewInvoice({data: doc.invoiceDetails!, mode: 'invoice'})} className="p-2 text-blue-500 hover:text-blue-700 bg-blue-50 rounded-lg" title="View"><Eye size={16}/></button>}
                                               {doc.status === 'Paid' && doc.invoiceDetails && <button onClick={() => setViewInvoice({data: doc.invoiceDetails!, mode: 'receipt'})} className="p-2 text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg" title="Receipt"><Receipt size={16}/></button>}
                                            </>
                                        )}
                                        {doc.url && <a href={doc.url} download className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-lg"><Download size={16}/></a>}
                                        <button onClick={() => contentService.deleteClientDocument(doc.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"><Trash2 size={16}/></button>
                                     </div>
                                  </div>
                               ))
                            )}
                         </div>
                      </div>
                   </div>
                </div>
             )}
           </>
        )}

      </main>
    </div>
  );
};

export default AdminPortal;
