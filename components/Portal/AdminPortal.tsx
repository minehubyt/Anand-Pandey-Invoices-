
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
  UserCheck, GraduationCap, Eye, Loader2, AlertTriangle, Crown, FilePlus, Receipt, CreditCard, Banknote, DollarSign, TrendingUp, AlertCircle, PenTool, Usb, Lock, KeyRound, HardDrive, AlertOctagon, ToggleLeft, ToggleRight, Settings, FileKey, HardDrive as HardDriveIcon, RefreshCcw, FileBadge, Package, Ban
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { contentService } from '../../services/contentService';
import { emailService } from '../../services/emailService';
import { HeroContent, Insight, Author, Inquiry, OfficeLocation, Job, JobApplication, UserProfile, ClientDocument, InvoiceDetails, InvoiceLineItem, PaymentRecord, InvoiceItemLibrary } from '../../types';
import { InvoiceRenderer } from './InvoiceRenderer';
import { InvoicePDF } from './InvoicePDF';

interface AdminPortalProps {
  onLogout: () => void;
}

type Tab = 'hero' | 'insights' | 'reports' | 'podcasts' | 'casestudy' | 'authors' | 'offices' | 'appointments' | 'rfp' | 'jobs' | 'applications' | 'clients' | 'finance' | 'library';

// --- NUMBER TO WORDS UTILITY ---
const numberToWords = (num: number): string => {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
  };

  if (num === 0) return 'ZERO';
  return (convert(Math.floor(num)) + ' ONLY').toUpperCase();
};

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
  accept?: string;
}> = ({ label, value, onChange, icon, accept = "image/*" }) => (
  <div>
    {label && <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">{label}</label>}
    <label className="flex items-center justify-center gap-3 p-4 border border-dashed border-slate-300 rounded-xl hover:border-[#CC1414] hover:bg-red-50 cursor-pointer transition-all bg-white group">
      <div className="text-slate-400 group-hover:text-[#CC1414]">{icon || <FileUp size={16} />}</div>
      <span className="text-xs uppercase tracking-widest text-slate-500 group-hover:text-slate-900">{value ? 'Replace File' : 'Select File'}</span>
      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            contentService.uploadImage(file).then(onChange);
          }
        }}
        accept={accept}
      />
    </label>
    {value && (
      <div className="mt-2 p-2 border rounded-lg bg-slate-50 flex items-center justify-between">
         {accept.includes('image') ? (
            <div className="h-20 w-auto overflow-hidden rounded"><img src={value} alt="Preview" className="h-full object-contain" /></div>
         ) : (
            <div className="flex items-center gap-2 text-xs text-slate-600"><FileText size={16} /> Document Uploaded</div>
         )}
         <button onClick={() => onChange('')} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
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
      if (['id', 'uniqueId', 'uploadedBy', 'status', 'uid', 'createdAt', 'assignedAdvocate', 'role'].includes(key)) return null;
      if (key === 'coordinates') return null;

      if (['isFeatured', 'showInHero'].includes(key)) {
         return (
            <div key={key} className="mb-6 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-900 block mb-1">
                     {key === 'isFeatured' ? 'Feature on Home Tab' : 'Show in Hero Section'}
                  </label>
                  <p className="text-[10px] text-slate-400">
                     {key === 'isFeatured' ? 'Display this item in the "Latest Insights" grid.' : 'Promote this item to the main top banner.'}
                  </p>
               </div>
               <button 
                  onClick={() => onChange({ ...entity, [key]: !entity[key] })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${entity[key] ? 'bg-[#CC1414]' : 'bg-slate-300'}`}
               >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${entity[key] ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>
         );
      }

      if (key === 'pdfUrl') {
         return (
            <div key={key} className="mb-6">
               <FileUploader 
                 label="Report PDF Document" 
                 value={entity[key]} 
                 onChange={(v) => onChange({ ...entity, [key]: v })}
                 icon={<FileText size={16} />}
                 accept=".pdf"
               />
            </div>
         );
      }

      if (['image', 'bannerImage', 'photo'].includes(key)) {
         return (
            <div key={key} className="mb-6">
               <FileUploader 
                 label={key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()} 
                 value={entity[key]} 
                 onChange={(v) => onChange({ ...entity, [key]: v })}
                 icon={<ImageIcon size={16} />}
               />
            </div>
         );
      }
      
      if (['content', 'bio', 'description'].includes(key)) {
         return (
            <div key={key} className="mb-6 space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Article Content</label>
               <textarea 
                 value={entity[key]} 
                 onChange={(e) => onChange({ ...entity, [key]: e.target.value })}
                 className="w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light bg-white border-slate-200 text-slate-900 min-h-[300px] text-sm leading-relaxed font-serif"
                 placeholder="Write the detailed article content here..."
               />
            </div>
         );
      }

      if (key === 'desc') {
         return (
            <div key={key} className="mb-6 space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Short Summary</label>
               <textarea 
                 value={entity[key]} 
                 onChange={(e) => onChange({ ...entity, [key]: e.target.value })}
                 className="w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light bg-white border-slate-200 text-slate-900 min-h-[80px]"
               />
            </div>
         );
      }
      
      return (
         <div key={key} className="mb-6">
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
       <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-reveal-up">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <h3 className="text-xl font-serif text-slate-900">Edit {tab === 'clients' ? 'CLIENT' : tab === 'library' ? 'SERVICE ITEM' : tab.slice(0, -1).toUpperCase()}</h3>
             <button onClick={onCancel}><X size={20} className="text-slate-400 hover:text-slate-900"/></button>
          </div>
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#FAFAFA]">
             {renderFields()}
          </div>
          <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-4 shadow-2xl z-10">
             <button onClick={onCancel} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">Cancel</button>
             <button onClick={onSave} className="px-8 py-3 bg-[#CC1414] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-colors">Save Changes</button>
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
  
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [premierClients, setPremierClients] = useState<UserProfile[]>([]);
  const [allInvoices, setAllInvoices] = useState<ClientDocument[]>([]);
  const [itemLibrary, setItemLibrary] = useState<InvoiceItemLibrary[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeEntity, setActiveEntity] = useState<any>(null);
  
  const [managingClient, setManagingClient] = useState<UserProfile | null>(null);
  const [clientDocs, setClientDocs] = useState<ClientDocument[]>([]);
  const [uploadDocType, setUploadDocType] = useState<'invoice' | 'document' | 'digital_invoice'>('document');
  const [docFile, setDocFile] = useState<string>('');
  const [docTitle, setDocTitle] = useState('');
  const [docAmount, setDocAmount] = useState('');
  const [creatingGlobalInvoice, setCreatingGlobalInvoice] = useState(false);
  
  const [viewInvoice, setViewInvoice] = useState<{data: InvoiceDetails, mode: 'invoice' | 'receipt'} | null>(null);
  const [selectedClientForInvoice, setSelectedClientForInvoice] = useState<string>('');

  const [recordingPaymentFor, setRecordingPaymentFor] = useState<ClientDocument | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentRecord>({
      amountCleared: 0,
      date: new Date().toISOString().split('T')[0],
      mode: 'NEFT/RTGS',
      transactionReference: ''
  });

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

  const financeStats = useMemo(() => {
    let revenue = 0;
    let pending = 0;
    let count = 0;
    allInvoices.forEach(inv => {
        if (inv.archived) return;
        const amount = inv.invoiceDetails?.totalAmount || 0;
        if (inv.status === 'Paid') revenue += amount;
        else if (inv.status !== 'Canceled') pending += amount;
        count++;
    });
    return { revenue, pending, count };
  }, [allInvoices]);

  const getNextInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();
    const pattern = new RegExp(`INV-(\\d+)-(\\d+)`);
    let maxSeq = 549; 
    
    allInvoices.forEach(inv => {
        if (inv.invoiceDetails?.invoiceNo) {
            const match = inv.invoiceDetails.invoiceNo.match(pattern);
            if (match) {
                const seq = parseInt(match[2], 10);
                if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
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
      contentService.subscribeAllInvoices(setAllInvoices),
      contentService.subscribeItemLibrary(setItemLibrary)
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  useEffect(() => {
    if (loading && (hero || insights.length > 0)) setLoading(false);
  }, [hero, insights]);

  // Update total in words automatically
  useEffect(() => {
    const total = invoiceForm.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    if (total !== invoiceForm.totalAmount) {
      setInvoiceForm(prev => ({
        ...prev,
        totalAmount: total,
        amountInWords: numberToWords(total)
      }));
    }
  }, [invoiceForm.items]);

  const handleEdit = (entity: any, tab?: Tab) => {
    if (tab) setActiveTab(tab);
    if (!entity) return; 
    setActiveEntity({ ...entity });
    setIsEditing(true);
  };

  const handleNew = () => {
    if (activeTab === 'clients') {
       setActiveEntity({ name: '', email: '', mobile: '', companyName: '', address: '', password: '' });
       setIsEditing(true);
       return;
    }
    if (activeTab === 'library') {
      setActiveEntity({ code: '', description: '', defaultAmount: 0 });
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
        if (activeTab === 'clients') {
            if (activeEntity.uid) await contentService.updateClientProfile(activeEntity.uid, activeEntity);
            else await contentService.createPremierUser(activeEntity);
        } else if (activeTab === 'library') {
          await contentService.saveLibraryItem(activeEntity);
        } else if (activeTab === 'hero') await contentService.saveHero(activeEntity);
        else if (['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab)) await contentService.saveInsight(activeEntity);
        else if (activeTab === 'authors') await contentService.saveAuthor(activeEntity);
        else if (activeTab === 'offices') await contentService.saveOffice(activeEntity);
        else if (activeTab === 'jobs') await contentService.saveJob(activeEntity);
        
        setIsEditing(false);
        setActiveEntity(null);
    } catch (err: any) {
        alert(`Failed to save: ${err.message}`);
    } finally { setIsSaving(false); }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("REVOKE INVOICE?\n\nThis will mark the invoice as Canceled. This action cannot be undone.")) return;
    await contentService.revokeInvoice(id);
    alert("Invoice successfully revoked.");
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

  const handleLibraryItemSelect = (idx: number, itemLibraryId: string) => {
    const libItem = itemLibrary.find(i => i.id === itemLibraryId);
    if (!libItem) return;
    updateInvoiceItem(idx, 'description', libItem.description);
    updateInvoiceItem(idx, 'amount', libItem.defaultAmount || 0);
    updateInvoiceItem(idx, 'itemCode', libItem.code);
  };

  const handleCreateDigitalInvoice = async () => {
     const targetClientId = creatingGlobalInvoice ? selectedClientForInvoice : managingClient?.uid;
     if (!targetClientId) { alert("Please select a client."); return; }
     
     setIsSaving(true);
     await contentService.addClientDocument({
        userId: targetClientId,
        type: 'invoice',
        title: `Invoice #${invoiceForm.invoiceNo}`,
        url: '', 
        uploadedBy: 'admin',
        date: invoiceForm.date,
        status: 'Pending',
        amount: `₹${invoiceForm.totalAmount.toLocaleString()}`,
        invoiceDetails: { ...invoiceForm },
        archived: false 
     });

     setIsSaving(false);
     setUploadDocType('document');
     setCreatingGlobalInvoice(false);
  };

  const updateInvoiceItem = (idx: number, field: keyof InvoiceLineItem, value: any) => {
     const newItems = [...invoiceForm.items];
     newItems[idx] = { ...newItems[idx], [field]: value };
     setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const addInvoiceItem = () => setInvoiceForm({ ...invoiceForm, items: [...invoiceForm.items, { id: Date.now().toString(), description: '', amount: 0 }] });
  const removeInvoiceItem = (idx: number) => setInvoiceForm({ ...invoiceForm, items: invoiceForm.items.filter((_, i) => i !== idx) });

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#0A0B0E]' : 'bg-[#F4F7FE]'}`}>
      {viewInvoice && <InvoiceRenderer data={viewInvoice.data} mode={viewInvoice.mode} onClose={() => setViewInvoice(null)} />}
      {isEditing && <EditorModal entity={activeEntity} tab={activeTab} onSave={handleSave} onCancel={() => { setIsEditing(false); setActiveEntity(null); }} onChange={(newEntity) => setActiveEntity(newEntity)} />}

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
          <div className="px-4 py-2 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Organization</div>
          <SidebarLink id="clients" active={activeTab} set={setActiveTab} label="Client Matrix" icon={<Crown size={18} />} isDark={isDarkMode} badge={premierClients.length} />
          <SidebarLink id="finance" active={activeTab} set={setActiveTab} label="Finance" icon={<Receipt size={18} />} isDark={isDarkMode} />
          <SidebarLink id="library" active={activeTab} set={setActiveTab} label="Service Library" icon={<Package size={18} />} isDark={isDarkMode} />
          <SidebarLink id="authors" active={activeTab} set={setActiveTab} label="Managing Authors" icon={<Users size={18} />} isDark={isDarkMode} />
          <SidebarLink id="jobs" active={activeTab} set={setActiveTab} label="Recruitment" icon={<Briefcase size={18} />} isDark={isDarkMode} />
          <div className="px-4 py-2 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Communications</div>
          <SidebarLink id="appointments" active={activeTab} set={setActiveTab} label="Appointments" icon={<Calendar size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type === 'appointment' && i.status === 'new').length} />
          <SidebarLink id="rfp" active={activeTab} set={setActiveTab} label="Mandate Inbox" icon={<Inbox size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type !== 'appointment' && i.status === 'new').length} />
        </nav>
        <div className="p-4 mt-auto border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#CC1414] hover:bg-red-50 transition-colors">
            <LogOut size={18} /> Exit Matrix
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-12 py-12 custom-scrollbar">
        <div className="flex justify-between items-center mb-16">
           <h2 className={`text-4xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab === 'library' ? 'Service Item Library' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
           {['insights', 'authors', 'offices', 'jobs', 'clients', 'library'].includes(activeTab) && (
             <button onClick={handleNew} className="px-8 py-4 bg-[#CC1414] text-white text-[11px] font-bold tracking-[0.3em] uppercase rounded-full shadow-xl flex items-center gap-3">
               <Plus size={18}/> Add Entity
             </button>
           )}
        </div>

        {activeTab === 'library' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemLibrary.map(item => (
              <div key={item.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-slate-50 text-[10px] font-bold uppercase rounded-lg text-slate-400 group-hover:text-[#CC1414] transition-colors">{item.code}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-slate-300 hover:text-blue-500"><Edit2 size={14}/></button>
                      <button onClick={() => contentService.deleteLibraryItem(item.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <h3 className="text-xl font-serif text-slate-900 mb-2">{item.description}</h3>
                </div>
                <p className="text-lg font-bold text-slate-900 pt-4 border-t border-slate-50">₹{(item.defaultAmount || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'finance' && !creatingGlobalInvoice && (
           <div className="space-y-8">
               <div className="grid grid-cols-3 gap-6">
                   <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"><div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24}/></div><div><p className="text-xs font-bold uppercase text-slate-400">Total Revenue</p><p className="text-2xl font-serif font-bold text-slate-900">₹{financeStats.revenue.toLocaleString()}</p></div></div>
                   <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"><div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock size={24}/></div><div><p className="text-xs font-bold uppercase text-slate-400">Pending</p><p className="text-2xl font-serif font-bold text-slate-900">₹{financeStats.pending.toLocaleString()}</p></div></div>
                   <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"><div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Receipt size={24}/></div><div><p className="text-xs font-bold uppercase text-slate-400">Invoices</p><p className="text-2xl font-serif font-bold text-slate-900">{financeStats.count}</p></div></div>
               </div>
               <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                      <thead><tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 bg-slate-50"><th className="p-6">Invoice #</th><th className="p-6">Client</th><th className="p-6 text-right">Amount</th><th className="p-6 text-center">Status</th><th className="p-6 text-right">Actions</th></tr></thead>
                      <tbody className="divide-y divide-slate-50">
                          {allInvoices.map(inv => (
                              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="p-6 text-sm font-bold text-slate-700">{inv.invoiceDetails?.invoiceNo}</td><td className="p-6 text-sm text-slate-700">{inv.invoiceDetails?.clientName}</td><td className="p-6 text-sm font-bold text-right text-slate-900">{inv.amount}</td>
                                  <td className="p-6 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : inv.status === 'Canceled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{inv.status}</span></td>
                                  <td className="p-6 text-right flex justify-end gap-2">
                                      {inv.status !== 'Paid' && inv.status !== 'Canceled' && (
                                        <button onClick={() => handleRevoke(inv.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Revoke/Cancel"><Ban size={14}/></button>
                                      )}
                                      <button onClick={() => setViewInvoice({data: inv.invoiceDetails!, mode: 'invoice'})} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-[10px] font-bold uppercase flex items-center gap-1"><Eye size={14}/> View</button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
               </div>
           </div>
        )}

        {creatingGlobalInvoice && (
           <div className="max-w-4xl mx-auto space-y-8 animate-reveal-up">
              <div className="flex justify-between items-center"><h3 className="text-2xl font-serif">New Digital Invoice</h3><button onClick={() => setCreatingGlobalInvoice(false)} className="p-2 hover:bg-slate-200 rounded-full"><X/></button></div>
              <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="text-[10px] font-bold uppercase text-slate-400">Select Client</label>
                    <select value={selectedClientForInvoice} onChange={(e) => handleClientSelect(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 mt-2">
                      <option value="">-- Choose Client --</option>
                      {premierClients.map(c => <option key={c.uid} value={c.uid}>{c.name} ({c.companyName || 'Ind.'})</option>)}
                    </select>
                  </div>
                  <div><label className="text-[10px] font-bold uppercase text-slate-400">Invoice No</label><input value={invoiceForm.invoiceNo} onChange={e => setInvoiceForm({...invoiceForm, invoiceNo: e.target.value})} className="w-full p-4 border rounded-xl bg-slate-50 mt-2" /></div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Line Items</p>
                  {invoiceForm.items.map((item, idx) => (
                    <div key={item.id} className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="grid grid-cols-[200px_1fr_150px_40px] gap-4 items-end">
                        <div>
                          <label className="text-[9px] font-bold uppercase text-slate-400">Service From Library</label>
                          <select 
                            onChange={(e) => handleLibraryItemSelect(idx, e.target.value)}
                            className="w-full p-3 border rounded-lg bg-white text-xs"
                          >
                            <option value="">-- Custom Item --</option>
                            {itemLibrary.map(lib => <option key={lib.id} value={lib.id}>{lib.code} - {lib.description}</option>)}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">Description</label>
                          <input value={item.description} onChange={e => updateInvoiceItem(idx, 'description', e.target.value)} className="w-full p-3 border rounded-lg bg-white text-xs" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold uppercase text-slate-400">Amount (₹)</label>
                          <input type="number" value={item.amount} onChange={e => updateInvoiceItem(idx, 'amount', e.target.value)} className="w-full p-3 border rounded-lg bg-white text-xs text-right" />
                        </div>
                        <button onClick={() => removeInvoiceItem(idx)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={addInvoiceItem} className="text-[10px] font-bold uppercase text-blue-600 flex items-center gap-1"><Plus size={14}/> Add New Item</button>
                </div>

                <div className="pt-6 border-t border-slate-100">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-400 text-sm font-bold uppercase">Total Amount</span>
                     <span className="text-2xl font-serif font-bold">₹{invoiceForm.totalAmount.toLocaleString()}</span>
                   </div>
                   <p className="text-xs text-slate-500 italic uppercase">Rupees {invoiceForm.amountInWords}</p>
                </div>

                <button onClick={handleCreateDigitalInvoice} disabled={isSaving || !selectedClientForInvoice} className="w-full py-5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-[#CC1414] transition-all shadow-xl disabled:opacity-50">Generate & File Invoice</button>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminPortal;
