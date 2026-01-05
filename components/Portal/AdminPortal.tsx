
import React, { useState, useEffect, useRef } from 'react';
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
  UserCheck, GraduationCap, Eye, Loader2, AlertTriangle, Crown, FilePlus, Receipt, CreditCard
} from 'lucide-react';
import { contentService } from '../../services/contentService';
import { emailService } from '../../services/emailService';
import { HeroContent, Insight, Author, Inquiry, OfficeLocation, Job, JobApplication, UserProfile, ClientDocument, InvoiceDetails, InvoiceLineItem } from '../../types';
import { InvoiceRenderer } from './InvoiceRenderer';

interface AdminPortalProps {
  onLogout: () => void;
}

type Tab = 'hero' | 'insights' | 'reports' | 'podcasts' | 'casestudy' | 'authors' | 'offices' | 'appointments' | 'rfp' | 'jobs' | 'applications' | 'clients';

const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Entities
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [premierClients, setPremierClients] = useState<UserProfile[]>([]);

  // Editor/Modal States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeEntity, setActiveEntity] = useState<any>(null);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  
  // Client Management States
  const [managingClient, setManagingClient] = useState<UserProfile | null>(null);
  const [clientDocs, setClientDocs] = useState<ClientDocument[]>([]);
  const [uploadDocType, setUploadDocType] = useState<'invoice' | 'document' | 'digital_invoice'>('document');
  const [docFile, setDocFile] = useState<string>('');
  const [docTitle, setDocTitle] = useState('');
  const [docAmount, setDocAmount] = useState('');
  const [invitingClient, setInvitingClient] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<InvoiceDetails | null>(null);

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
    terms: [
      "This Bill is payable by Electronic transfer/ Cheque in favor of AK Pandey & Associates.",
      "Please make payment within 15 days of receipt of this invoice.",
      "Bank Details: HDFC BANK, Account Number: XXXXXXXXXX, IFSC Code: HDFC000XXXX.",
      "Invoices are non-taxable as per the current service agreement for legal consultancy.",
      "Disputes subject to New Delhi Jurisdiction."
    ]
  });

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
      contentService.getPremierClients(setPremierClients)
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  useEffect(() => {
    if (loading && (hero || insights.length > 0)) setLoading(false);
  }, [hero, insights]);

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
       setActiveEntity({ name: '', email: '', mobile: '', companyName: '' });
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
           await contentService.invitePremierClient(activeEntity);
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
     // Pre-fill invoice client data
     setInvoiceForm(prev => ({
        ...prev,
        clientName: client.companyName || client.name,
        kindAttn: client.name,
        invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`
     }));
  };

  const handleCreateDigitalInvoice = async () => {
     if (!managingClient) return;
     setIsSaving(true);
     
     // Calculate Totals
     const total = invoiceForm.items.reduce((sum, item) => sum + Number(item.amount), 0);
     const amountWords = `${total} ONLY`; // Placeholder for simple logic, ideal to use a lib

     const finalInvoice: InvoiceDetails = {
        ...invoiceForm,
        totalAmount: total,
        amountInWords: amountWords.toUpperCase() // Basic conversion
     };

     await contentService.addClientDocument({
        userId: managingClient.uid,
        type: 'invoice',
        title: `Invoice #${finalInvoice.invoiceNo}`,
        url: '', // Digital invoice has no file URL initially
        uploadedBy: 'admin',
        date: invoiceForm.date,
        status: 'Pending',
        amount: `₹${total.toLocaleString()}`,
        invoiceDetails: finalInvoice
     });

     setIsSaving(false);
     setUploadDocType('document'); // Reset view
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

  const filteredInquiries = inquiries.filter(i => 
    (activeTab === 'appointments' ? i.type === 'appointment' : i.type !== 'appointment') &&
    (i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#0A0B0E]' : 'bg-[#F4F7FE]'}`}>
      {viewInvoice && <InvoiceRenderer data={viewInvoice} onClose={() => setViewInvoice(null)} />}
      
      <aside className={`w-[290px] flex flex-col h-full shrink-0 border-r ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-200'}`}>
        {/* ... Sidebar Content Same as Before ... */}
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
          <SidebarLink id="authors" active={activeTab} set={setActiveTab} label="Managing Authors" icon={<Users size={18} />} isDark={isDarkMode} />
          <SidebarLink id="jobs" active={activeTab} set={setActiveTab} label="Recruitment" icon={<Briefcase size={18} />} isDark={isDarkMode} />
          <SidebarLink id="applications" active={activeTab} set={setActiveTab} label="Talent Pool" icon={<UserCheck size={18} />} isDark={isDarkMode} badge={applications.filter(a => a.status === 'Received').length} />
          <div className="px-4 py-2 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Communications</div>
          <SidebarLink id="appointments" active={activeTab} set={setActiveTab} label="Appointments" icon={<Calendar size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type === 'appointment' && i.status === 'new').length} />
          <SidebarLink id="rfp" active={activeTab} set={setActiveTab} label="Mandate Inbox" icon={<Inbox size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type !== 'appointment' && i.status === 'new').length} />
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
                {activeTab === 'clients' ? 'Premier Client Matrix' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
           </div>
           
           {['hero', 'insights', 'reports', 'podcasts', 'authors', 'offices', 'jobs', 'clients'].includes(activeTab) && !isEditing && (
             <button 
              onClick={activeTab === 'hero' ? () => handleEdit(hero) : handleNew}
              className="px-10 py-5 bg-[#CC1414] text-white text-[11px] font-bold tracking-[0.3em] uppercase rounded-full hover:scale-105 transition-all shadow-xl shadow-red-500/20 flex items-center gap-3"
             >
               {activeTab === 'hero' ? <Edit2 size={18}/> : <Plus size={18}/>}
               {activeTab === 'hero' ? 'Update Banner' : activeTab === 'clients' ? 'Invite Client' : 'Add Entity'}
             </button>
           )}
        </div>

        {/* --- CLIENT INVITATION FORM --- */}
        {(invitingClient || (isEditing && activeTab !== 'clients')) && (
           <div className={`p-12 rounded-3xl border shadow-2xl relative mb-12 animate-fade-in ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-serif">{invitingClient ? 'Invite Premier Client' : 'Editing Entity'}</h3>
                  <button onClick={() => { setIsEditing(false); setInvitingClient(false); }} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
               </div>
               
               {invitingClient ? (
                 <div className="grid grid-cols-2 gap-8">
                     <InputField label="Client Name" value={activeEntity.name} onChange={(v: string) => setActiveEntity({...activeEntity, name: v})} isDark={isDarkMode} />
                     <InputField label="Company Name" value={activeEntity.companyName} onChange={(v: string) => setActiveEntity({...activeEntity, companyName: v})} isDark={isDarkMode} />
                     <InputField label="Email Address" value={activeEntity.email} onChange={(v: string) => setActiveEntity({...activeEntity, email: v})} isDark={isDarkMode} />
                     <InputField label="Mobile Number" value={activeEntity.mobile} onChange={(v: string) => setActiveEntity({...activeEntity, mobile: v})} isDark={isDarkMode} />
                 </div>
               ) : (
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12">
                       <InputField label="Title/Name" value={activeEntity.title || activeEntity.name || ''} onChange={(v: string) => activeEntity.title !== undefined ? setActiveEntity({...activeEntity, title: v}) : setActiveEntity({...activeEntity, name: v})} isDark={isDarkMode} />
                    </div>
                 </div>
               )}

               <div className="pt-12 border-t border-white/5 flex gap-6 mt-8">
                  <button 
                     onClick={handleSave} 
                     disabled={isSaving}
                     className="flex-1 py-5 bg-[#CC1414] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                     {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                     {invitingClient ? 'SEND INVITATION' : 'SAVE CHANGES'}
                  </button>
               </div>
           </div>
        )}

        {/* --- CLIENTS LIST --- */}
        {activeTab === 'clients' && !managingClient && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premierClients.map(client => (
                 <div key={client.uid} className={`p-8 rounded-3xl border group hover:shadow-2xl transition-all ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-start justify-between mb-6">
                       <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-serif text-2xl font-bold">
                          {client.name.charAt(0)}
                       </div>
                       <button onClick={() => openClientManager(client)} className="p-3 bg-slate-50 hover:bg-[#CC1414] hover:text-white rounded-xl transition-colors"><Edit2 size={16}/></button>
                    </div>
                    <h3 className={`text-2xl font-serif mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{client.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#CC1414] mb-4">{client.companyName || 'Independent'}</p>
                    <p className="text-slate-400 text-sm mb-6 flex items-center gap-2"><Mail size={14}/> {client.email}</p>
                    
                    <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                          {client.assignedAdvocate?.photo ? <img src={client.assignedAdvocate.photo} className="w-full h-full object-cover"/> : <Users size={18} className="m-2.5 text-slate-400"/>}
                       </div>
                       <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Liaison</p>
                          <p className={`text-sm font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{client.assignedAdvocate?.name || 'Unassigned'}</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* --- CLIENT MANAGER (CRM) --- */}
        {managingClient && (
           <div className={`p-10 rounded-3xl border shadow-2xl relative animate-fade-in ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
              <button onClick={() => setManagingClient(null)} className="absolute top-8 right-8 p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
              
              <div className="flex gap-8 items-center mb-12">
                 <div className="w-20 h-20 bg-[#CC1414] rounded-2xl flex items-center justify-center text-white font-serif text-3xl">{managingClient.name.charAt(0)}</div>
                 <div>
                    <h2 className="text-4xl font-serif">{managingClient.name}</h2>
                    <p className="text-[#CC1414] font-bold uppercase tracking-widest text-xs mt-2">{managingClient.companyName} • {managingClient.email}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b pb-4">Strategic Liaison Assignment</h3>
                    <div className="grid grid-cols-2 gap-4">
                       {authors.map(author => (
                          <button 
                             key={author.id} 
                             onClick={() => handleAssignAdvocate(author)}
                             className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${managingClient.assignedAdvocate?.email === author.email ? 'border-[#CC1414] bg-[#CC1414]/5' : 'border-slate-100 hover:border-slate-300'}`}
                          >
                             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                <img src={author.image} className="w-full h-full object-cover"/>
                             </div>
                             <div>
                                <p className="font-bold text-sm">{author.name}</p>
                                <p className="text-[10px] text-slate-500">{author.title}</p>
                             </div>
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b pb-4">Document Vault</h3>
                    
                    <div className="flex gap-4 mb-2">
                       <select value={uploadDocType} onChange={(e:any) => setUploadDocType(e.target.value)} className="p-3 border rounded-xl bg-slate-50 text-sm">
                          <option value="document">Brief / Contract</option>
                          <option value="invoice">Legacy Invoice (Upload)</option>
                          <option value="digital_invoice">Generate Digital Invoice</option>
                       </select>
                       {uploadDocType !== 'digital_invoice' && (
                          <input value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Document Title" className="flex-1 p-3 border rounded-xl text-sm" />
                       )}
                    </div>

                    {uploadDocType === 'invoice' && (
                       <input value={docAmount} onChange={e => setDocAmount(e.target.value)} placeholder="Invoice Amount (e.g. ₹50,000)" className="w-full p-3 border rounded-xl text-sm mb-4 bg-slate-50" />
                    )}

                    {uploadDocType === 'digital_invoice' ? (
                        // --- DIGITAL INVOICE FORM ---
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <input value={invoiceForm.invoiceNo} onChange={e => setInvoiceForm({...invoiceForm, invoiceNo: e.target.value})} placeholder="Invoice No" className="p-3 border rounded-xl text-sm" />
                              <input type="date" value={invoiceForm.date} onChange={e => setInvoiceForm({...invoiceForm, date: e.target.value})} className="p-3 border rounded-xl text-sm" />
                           </div>
                           <input value={invoiceForm.kindAttn} onChange={e => setInvoiceForm({...invoiceForm, kindAttn: e.target.value})} placeholder="Kind Attn" className="w-full p-3 border rounded-xl text-sm" />
                           <textarea value={invoiceForm.clientAddress} onChange={e => setInvoiceForm({...invoiceForm, clientAddress: e.target.value})} placeholder="Client Address" className="w-full p-3 border rounded-xl text-sm h-20" />
                           <textarea value={invoiceForm.mailingAddress} onChange={e => setInvoiceForm({...invoiceForm, mailingAddress: e.target.value})} placeholder="Mailing Address" className="w-full p-3 border rounded-xl text-sm h-20" />
                           
                           <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase">Line Items</p>
                              {invoiceForm.items.map((item, idx) => (
                                 <div key={item.id} className="flex gap-2">
                                    <input value={item.description} onChange={e => updateInvoiceItem(idx, 'description', e.target.value)} placeholder="Item Desc" className="flex-1 p-2 border rounded-lg text-sm" />
                                    <input type="number" value={item.amount} onChange={e => updateInvoiceItem(idx, 'amount', e.target.value)} placeholder="Amount" className="w-24 p-2 border rounded-lg text-sm" />
                                    <button onClick={() => removeInvoiceItem(idx)} className="text-red-500"><Trash2 size={16}/></button>
                                 </div>
                              ))}
                              <button onClick={addInvoiceItem} className="text-[10px] font-bold uppercase text-blue-600 flex items-center gap-1"><Plus size={12}/> Add Item</button>
                           </div>

                           <button onClick={handleCreateDigitalInvoice} disabled={isSaving} className="w-full py-3 bg-[#CC1414] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2">
                              {isSaving ? <Loader2 className="animate-spin"/> : <CreditCard size={16}/>} Generate Invoice
                           </button>
                        </div>
                    ) : (
                       // --- STANDARD UPLOAD ---
                       <>
                          <FileUploader label="Upload File (PDF/Image)" value={docFile} onChange={setDocFile} icon={<FilePlus/>} />
                          <button onClick={handleUploadClientDoc} disabled={!docFile || isSaving} className="w-full py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#CC1414] disabled:opacity-50">
                             {isSaving ? 'Uploading...' : 'Add to Client Vault'}
                          </button>
                       </>
                    )}

                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                       {clientDocs.map(doc => (
                          <div key={doc.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                             <div className="flex items-center gap-3">
                                {doc.type === 'invoice' ? <Receipt size={16} className="text-green-600"/> : <FileText size={16} className="text-slate-400"/>}
                                <div>
                                   <p className="text-sm font-bold">{doc.title}</p>
                                   <p className="text-[10px] text-slate-400">{new Date(doc.date).toLocaleDateString()} {doc.amount ? `• ${doc.amount}` : ''}</p>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                {doc.invoiceDetails && (
                                   <button onClick={() => setViewInvoice(doc.invoiceDetails!)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"><Eye size={14}/></button>
                                )}
                                <button onClick={() => contentService.deleteClientDocument(doc.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={14}/></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Existing Lists */}
        {!isEditing && !invitingClient && !managingClient && activeTab !== 'clients' && (
           <div className="space-y-8">
              {/* Reuse list logic for jobs etc. */}
              {activeTab === 'jobs' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {jobs.map(job => (
                      <div key={job.id} className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'} relative`}>
                         <h3 className="text-2xl font-serif">{job.title}</h3>
                         <div className="flex gap-2 mt-4"><button onClick={() => handleEdit(job)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-lg">Edit</button></div>
                      </div>
                    ))}
                 </div>
              )}
           </div>
        )}
      </main>
    </div>
  );
};

// Reusing existing components...
const SidebarLink = ({ id, active, set, label, icon, isDark, badge }: any) => (
  <button 
    onClick={() => set(id)} 
    className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 transform active:scale-95 ${active === id ? 'bg-[#CC1414] text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    {icon}
    <span className="text-[13px] font-bold tracking-widest uppercase flex-1 text-left">{label}</span>
    {badge ? <span className="px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold rounded-full">{badge}</span> : null}
  </button>
);

const InputField = ({ label, value, onChange, isDark, icon, type = "text" }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
       {icon} {label}
    </label>
    <input 
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
    />
  </div>
);

const FileUploader = ({ label, value, onChange, icon }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
    <div className="flex items-center gap-4">
       <div className="flex-1 p-4 bg-slate-100 rounded-xl text-slate-400 text-xs overflow-hidden truncate">
          {value ? 'File Selected (Ready to Upload)' : 'No file chosen.'}
       </div>
       <label className="px-6 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-[#CC1414] transition-all flex items-center gap-2">
          {icon} Choose
          <input 
            type="file" 
            className="hidden" 
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => onChange(reader.result);
                reader.readAsDataURL(file);
              }
            }}
          />
       </label>
    </div>
  </div>
);

export default AdminPortal;
