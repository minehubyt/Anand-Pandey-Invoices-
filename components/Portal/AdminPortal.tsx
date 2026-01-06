
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
  UserCheck, GraduationCap, Eye, Loader2, AlertTriangle, Crown, FilePlus, Receipt, CreditCard, Banknote, DollarSign, TrendingUp, AlertCircle
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer'; // Import PDF generator
import { contentService } from '../../services/contentService';
import { emailService } from '../../services/emailService';
import { HeroContent, Insight, Author, Inquiry, OfficeLocation, Job, JobApplication, UserProfile, ClientDocument, InvoiceDetails, InvoiceLineItem, PaymentRecord } from '../../types';
import { InvoiceRenderer } from './InvoiceRenderer';
import { InvoicePDF } from './InvoicePDF'; // Import the PDF Component

interface AdminPortalProps {
  onLogout: () => void;
}

type Tab = 'hero' | 'insights' | 'reports' | 'podcasts' | 'casestudy' | 'authors' | 'offices' | 'appointments' | 'rfp' | 'jobs' | 'applications' | 'clients' | 'finance';

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
  
  // Invoice Viewer State (Supports Invoice View & Receipt View)
  const [viewInvoice, setViewInvoice] = useState<{data: InvoiceDetails, mode: 'invoice' | 'receipt'} | null>(null);
  const [selectedClientForInvoice, setSelectedClientForInvoice] = useState<string>('');

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
        // Ensure amount is treated as number
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
    let maxSeq = 549; // Start from 549, so the first generated will be 550

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

    return `INV-${currentYear}-${maxSeq + 1}`;
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
            amountInWords: ''
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
            amountInWords: ''
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
     // Pre-fill invoice data with client address
     setInvoiceForm(prev => ({
        ...prev,
        clientName: client.companyName || client.name,
        kindAttn: client.name,
        clientAddress: client.address || '',
        mailingAddress: client.address || '',
        invoiceNo: getNextInvoiceNumber()
     }));
  };

  // Helper to handle invoice selection change in global invoice creator
  const handleClientSelect = (clientId: string) => {
      setSelectedClientForInvoice(clientId);
      const client = premierClients.find(c => c.uid === clientId);
      if (client) {
          // Auto-fetch address when client is selected
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
     
     // 1. Save to DB (Auto-syncs to Dashboard via Firestore subscription)
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

     // 2. Generate PDF and Send Email Notification
     try {
        // Generate PDF Blob - Force Type 'invoice'
        const blob = await pdf(<InvoicePDF data={finalInvoice} type="invoice" />).toBlob();
        
        // Convert Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            const base64data = reader.result?.toString().split(',')[1];
            // Send email with attachment
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
          // Regenerate PDF Blob - Force Type 'invoice' to ensure clean document
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
      
      // 1. Update Database
      await contentService.updateDocumentStatus(recordingPaymentFor.id, 'Paid', paymentForm);

      // 2. Prepare Receipt Data
      const targetClient = premierClients.find(c => c.uid === recordingPaymentFor.userId);
      
      if (targetClient && recordingPaymentFor.invoiceDetails) {
          const updatedInvoiceDetails: InvoiceDetails = {
              ...recordingPaymentFor.invoiceDetails,
              payment: paymentForm
          };

          try {
              // 3. Generate Receipt PDF - Force Type 'receipt'
              const blob = await pdf(<InvoicePDF data={updatedInvoiceDetails} type="receipt" />).toBlob();
              
              // 4. Convert to Base64 & Send Email
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

  // --- RENDER HELPERS ---

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
                            {/* Send Email Button */}
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
                            {/* View Invoice Action */}
                            <button onClick={() => setViewInvoice({data: inv.invoiceDetails!, mode: 'invoice'})} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-[10px] font-bold uppercase flex items-center gap-1">
                                <Eye size={14}/> View
                            </button>
                            {/* View Receipt Action - Only if Paid */}
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

  // New Helper Function 1: Applications Table
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

  // New Helper Function 2: Inquiries Table
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

  // ... rest of the component
  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#0A0B0E]' : 'bg-[#F4F7FE]'}`}>
      {viewInvoice && <InvoiceRenderer data={viewInvoice.data} mode={viewInvoice.mode} onClose={() => setViewInvoice(null)} />}
      {recordingPaymentFor && renderPaymentModal()}
      
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
           
           {['hero', 'insights', 'reports', 'podcasts', 'authors', 'offices', 'jobs', 'clients', 'finance'].includes(activeTab) && !isEditing && (
             <button 
              onClick={activeTab === 'hero' ? () => handleEdit(hero) : handleNew}
              className="px-10 py-5 bg-[#CC1414] text-white text-[11px] font-bold tracking-[0.3em] uppercase rounded-full hover:scale-105 transition-all shadow-xl shadow-red-500/20 flex items-center gap-3"
             >
               {activeTab === 'hero' ? <Edit2 size={18}/> : <Plus size={18}/>}
               {activeTab === 'hero' ? 'Update Banner' : activeTab === 'clients' ? 'Add Client' : activeTab === 'finance' ? 'Create Invoice' : 'Add Entity'}
             </button>
           )}
        </div>

        {/* ... (Existing code for creating invoices, client management etc.) ... */}
        {creatingGlobalInvoice && (
            <div className={`p-12 rounded-3xl border shadow-2xl relative mb-12 animate-fade-in ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-serif">Create New Invoice</h3>
                  <button onClick={() => setCreatingGlobalInvoice(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
               </div>
               {renderDigitalInvoiceForm()}
            </div>
        )}

        {/* ... (Existing Client Invitation Form & Entity Editor - Unchanged) ... */}
        {invitingClient && (
           <div className={`p-12 rounded-3xl border shadow-2xl relative mb-12 animate-fade-in ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-serif">Add New Client</h3>
                  <button onClick={() => setInvitingClient(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
               </div>
               
               <div className="grid grid-cols-2 gap-8">
                   <InputField label="Client Name" value={activeEntity.name} onChange={(v: string) => setActiveEntity({...activeEntity, name: v})} isDark={isDarkMode} />
                   <InputField label="Company Name" value={activeEntity.companyName} onChange={(v: string) => setActiveEntity({...activeEntity, companyName: v})} isDark={isDarkMode} />
                   <InputField label="Email Address" value={activeEntity.email} onChange={(v: string) => setActiveEntity({...activeEntity, email: v})} isDark={isDarkMode} />
                   <InputField label="Mobile Number" value={activeEntity.mobile} onChange={(v: string) => setActiveEntity({...activeEntity, mobile: v})} isDark={isDarkMode} />
                   
                   {/* NEW PASSWORD FIELD */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                         <ShieldCheck size={14}/> Access Password
                      </label>
                      <input 
                        type="text"
                        value={activeEntity.password || ''}
                        onChange={e => setActiveEntity({...activeEntity, password: e.target.value})}
                        className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                        placeholder="Create initial password"
                      />
                   </div>

                   <div className="col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Full Address</label>
                      <textarea 
                         value={activeEntity.address} 
                         onChange={(e) => setActiveEntity({...activeEntity, address: e.target.value})} 
                         className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                         placeholder="Enter billing address..."
                         rows={3}
                      />
                   </div>
               </div>

               <div className="pt-12 border-t border-white/5 flex gap-6 mt-8">
                  <button 
                     onClick={handleSave} 
                     disabled={isSaving}
                     className="flex-1 py-5 bg-[#CC1414] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                     {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                     CREATE CLIENT DASHBOARD
                  </button>
               </div>
           </div>
        )}

        {/* --- FULL ENTITY EDITOR --- */}
        {isEditing && !invitingClient && activeTab !== 'clients' && activeTab !== 'finance' && (
           <div className={`p-12 rounded-3xl border shadow-2xl relative mb-12 animate-fade-in ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-serif">Editing {activeTab === 'hero' ? 'Hero Banner' : activeTab.slice(0, -1)}</h3>
                  <button onClick={() => setIsEditing(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  {/* HERO EDITOR */}
                  {activeTab === 'hero' && (
                     <div className="lg:col-span-8 space-y-8">
                        <InputField label="Headline" value={activeEntity.headline} onChange={(v: string) => setActiveEntity({...activeEntity, headline: v})} isDark={isDarkMode} />
                        <InputField label="Subtext" value={activeEntity.subtext} onChange={(v: string) => setActiveEntity({...activeEntity, subtext: v})} isDark={isDarkMode} />
                        <InputField label="CTA Text" value={activeEntity.ctaText} onChange={(v: string) => setActiveEntity({...activeEntity, ctaText: v})} isDark={isDarkMode} />
                        <FileUploader label="Background Image" value={activeEntity.backgroundImage} onChange={(v: string) => setActiveEntity({...activeEntity, backgroundImage: v})} icon={<ImageIcon/>} />
                     </div>
                  )}

                  {/* INSIGHTS / REPORTS / CASE STUDIES EDITOR */}
                  {['insights', 'reports', 'casestudy', 'podcasts'].includes(activeTab) && (
                     <>
                        <div className="lg:col-span-8 space-y-8">
                           <div className="grid grid-cols-2 gap-8">
                              <InputField label="Title" value={activeEntity.title} onChange={(v: string) => setActiveEntity({...activeEntity, title: v})} isDark={isDarkMode} />
                              <InputField label="Category" value={activeEntity.category} onChange={(v: string) => setActiveEntity({...activeEntity, category: v})} isDark={isDarkMode} />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Short Description</label>
                              <textarea className={`w-full p-4 border rounded-xl h-32 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200'}`} value={activeEntity.desc} onChange={e => setActiveEntity({...activeEntity, desc: e.target.value})} />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Content / Analysis</label>
                              <textarea className={`w-full p-4 border rounded-xl h-64 font-mono text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200'}`} value={activeEntity.content} onChange={e => setActiveEntity({...activeEntity, content: e.target.value})} />
                           </div>
                           {activeTab === 'reports' && (
                              <InputField label="PDF Download URL" value={activeEntity.pdfUrl} onChange={(v: string) => setActiveEntity({...activeEntity, pdfUrl: v})} isDark={isDarkMode} />
                           )}
                        </div>
                        <div className="lg:col-span-4 space-y-8">
                           <FileUploader label="Thumbnail Image" value={activeEntity.image} onChange={(v: string) => setActiveEntity({...activeEntity, image: v})} icon={<ImageIcon/>} />
                           <FileUploader label="Banner Image (Detail Page)" value={activeEntity.bannerImage} onChange={(v: string) => setActiveEntity({...activeEntity, bannerImage: v})} icon={<ImageIcon/>} />
                           
                           <div className="p-6 border rounded-xl space-y-4">
                              <label className="flex items-center gap-4 cursor-pointer">
                                 <input type="checkbox" checked={activeEntity.isFeatured} onChange={e => setActiveEntity({...activeEntity, isFeatured: e.target.checked})} className="w-5 h-5 accent-[#CC1414]" />
                                 <span className="text-sm font-bold">Feature in Carousel</span>
                              </label>
                              <label className="flex items-center gap-4 cursor-pointer">
                                 <input type="checkbox" checked={activeEntity.showInHero} onChange={e => setActiveEntity({...activeEntity, showInHero: e.target.checked})} className="w-5 h-5 accent-[#CC1414]" />
                                 <span className="text-sm font-bold">Show in Hero Slider</span>
                              </label>
                           </div>
                        </div>
                     </>
                  )}

                  {/* AUTHORS EDITOR */}
                  {activeTab === 'authors' && (
                     <>
                       <div className="lg:col-span-8 space-y-8">
                          <div className="grid grid-cols-2 gap-8">
                             <InputField label="Full Name" value={activeEntity.name} onChange={(v: string) => setActiveEntity({...activeEntity, name: v})} isDark={isDarkMode} />
                             <InputField label="Title / Designation" value={activeEntity.title} onChange={(v: string) => setActiveEntity({...activeEntity, title: v})} isDark={isDarkMode} />
                          </div>
                          <InputField label="Email" value={activeEntity.email} onChange={(v: string) => setActiveEntity({...activeEntity, email: v})} isDark={isDarkMode} />
                          <div className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Biography</label>
                              <textarea className={`w-full p-4 border rounded-xl h-32 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200'}`} value={activeEntity.bio} onChange={e => setActiveEntity({...activeEntity, bio: e.target.value})} />
                           </div>
                       </div>
                       <div className="lg:col-span-4">
                          <FileUploader label="Profile Photo" value={activeEntity.image} onChange={(v: string) => setActiveEntity({...activeEntity, image: v})} icon={<Users/>} />
                       </div>
                     </>
                  )}

                  {/* OFFICES EDITOR */}
                  {activeTab === 'offices' && (
                     <div className="lg:col-span-8 space-y-8">
                        <InputField label="City" value={activeEntity.city} onChange={(v: string) => setActiveEntity({...activeEntity, city: v})} isDark={isDarkMode} />
                        <InputField label="Address" value={activeEntity.address} onChange={(v: string) => setActiveEntity({...activeEntity, address: v})} isDark={isDarkMode} />
                        <div className="grid grid-cols-2 gap-8">
                           <InputField label="Phone" value={activeEntity.phone} onChange={(v: string) => setActiveEntity({...activeEntity, phone: v})} isDark={isDarkMode} />
                           <InputField label="Email" value={activeEntity.email} onChange={(v: string) => setActiveEntity({...activeEntity, email: v})} isDark={isDarkMode} />
                        </div>
                        <FileUploader label="Office Image" value={activeEntity.image} onChange={(v: string) => setActiveEntity({...activeEntity, image: v})} icon={<MapPin/>} />
                     </div>
                  )}

                  {/* JOBS EDITOR */}
                  {activeTab === 'jobs' && (
                     <div className="lg:col-span-8 space-y-8">
                        <InputField label="Job Title" value={activeEntity.title} onChange={(v: string) => setActiveEntity({...activeEntity, title: v})} isDark={isDarkMode} />
                        <div className="grid grid-cols-2 gap-8">
                           <InputField label="Department" value={activeEntity.department} onChange={(v: string) => setActiveEntity({...activeEntity, department: v})} isDark={isDarkMode} />
                           <InputField label="Location" value={activeEntity.location} onChange={(v: string) => setActiveEntity({...activeEntity, location: v})} isDark={isDarkMode} />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Job Description</label>
                           <textarea className={`w-full p-4 border rounded-xl h-48 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200'}`} value={activeEntity.description} onChange={e => setActiveEntity({...activeEntity, description: e.target.value})} />
                        </div>
                        <select 
                           value={activeEntity.status} 
                           onChange={e => setActiveEntity({...activeEntity, status: e.target.value})}
                           className={`w-full p-4 border rounded-xl ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200'}`}
                        >
                           <option value="active">Active</option>
                           <option value="closed">Closed</option>
                        </select>
                     </div>
                  )}
               </div>

               <div className="pt-12 border-t border-white/5 flex gap-6 mt-8">
                  <button 
                     onClick={handleSave} 
                     disabled={isSaving}
                     className="flex-1 py-5 bg-[#CC1414] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                     {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                     SAVE CHANGES
                  </button>
               </div>
           </div>
        )}

        {/* --- CLIENTS LIST --- */}
        {activeTab === 'clients' && !managingClient && !invitingClient && (
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

        {/* ... (Client Manager Section Unchanged) ... */}
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
                        renderDigitalInvoiceForm()
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
                                   <button onClick={() => setViewInvoice({data: doc.invoiceDetails!, mode: 'invoice'})} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"><Eye size={14}/></button>
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
        {!isEditing && !invitingClient && !managingClient && !creatingGlobalInvoice && activeTab !== 'clients' && (
           <div className="space-y-8">
              
              {/* APPLICATIONS LIST */}
              {activeTab === 'applications' && renderApplicationsTable()}

              {/* APPOINTMENTS LIST */}
              {activeTab === 'appointments' && renderInquiriesTable('appointment')}

              {/* RFP/MANDATE INBOX LIST */}
              {activeTab === 'rfp' && renderInquiriesTable('rfp')}

              {/* FINANCE INVOICES LIST */}
              {activeTab === 'finance' && renderFinanceTable()}

              {/* JOBS LIST */}
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
              {/* Default List View for other entities (like Insights) - Restored */}
              {['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab) && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {insights.filter(i => i.type === activeTab).map(item => (
                       <div key={item.id} className={`p-6 rounded-3xl border group ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
                          <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden mb-4 relative">
                             <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                             {item.isFeatured && <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded">FEATURED</span>}
                          </div>
                          <h4 className="font-serif text-lg leading-tight mb-2 line-clamp-2">{item.title}</h4>
                          <div className="flex justify-between items-center mt-4">
                             <button onClick={() => handleEdit(item)} className="text-[10px] font-bold uppercase bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200">Edit</button>
                             <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
              {activeTab === 'hero' && hero && (
                 <div className="p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden group cursor-pointer" onClick={() => handleEdit(hero)}>
                    <img src={hero.backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                    <div className="relative z-10">
                       <h1 className="text-4xl font-serif mb-4">{hero.headline}</h1>
                       <p className="text-xl font-light opacity-80">{hero.subtext}</p>
                       <div className="mt-8 inline-block px-6 py-2 border border-white/30 rounded-full text-xs font-bold uppercase">{hero.ctaText}</div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={20}/></div>
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

const InputField = ({ label, value, onChange, isDark, icon, type = "text", placeholder }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
       {icon} {label}
    </label>
    <input 
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
    />
  </div>
);

const FileUploader = ({ label, value, onChange, icon }: any) => {
  const [uploading, setUploading] = useState(false);
  const [useUrl, setUseUrl] = useState(false); // Mode toggle: true = URL input, false = File Upload

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        // Use smart iterative compression service
        const url = await contentService.uploadImage(file);
        onChange(url);
      } catch (error: any) {
        console.error("Upload Error:", error);
        alert(`Failed to process image. Please try again with a standard format (JPG/PNG). Error: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
         <div className="flex gap-2">
            <button 
               onClick={() => setUseUrl(false)} 
               className={`text-[9px] font-bold uppercase px-3 py-1 rounded transition-colors ${!useUrl ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
            >
               Upload File
            </button>
            <button 
               onClick={() => setUseUrl(true)} 
               className={`text-[9px] font-bold uppercase px-3 py-1 rounded transition-colors ${useUrl ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
            >
               Image URL
            </button>
         </div>
      </div>

      {useUrl ? (
         <div className="flex items-center gap-4">
            <div className="flex-1">
               <input 
                  type="text" 
                  value={value && value.startsWith('http') ? value : ''} 
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Paste direct image link (e.g. https://images.unsplash.com/...)"
                  className="w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light text-sm bg-slate-50 border-slate-200"
               />
            </div>
            {value && <img src={value} alt="Preview" className="h-12 w-12 object-cover rounded-lg border border-slate-200" />}
         </div>
      ) : (
         <div className="flex items-center gap-4">
            <div className="flex-1 p-4 bg-slate-100 rounded-xl text-slate-400 text-xs overflow-hidden truncate flex items-center justify-between">
               <span>{value ? (value.startsWith('data:') ? 'Image Compressed & Ready' : 'External Image Linked') : 'No file chosen'}</span>
               {value && <img src={value} alt="Preview" className="h-8 w-8 object-cover rounded ml-2" />}
            </div>
            <label className={`px-6 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-[#CC1414] transition-all flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
               {uploading ? <Loader2 className="animate-spin" size={16}/> : icon} 
               {uploading ? 'Processing...' : 'Choose File'}
               <input 
               type="file" 
               className="hidden" 
               disabled={uploading}
               accept="image/*"
               onChange={handleFileChange}
               />
            </label>
         </div>
      )}
      
      {value && (
         <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1">
            <CheckCircle size={10}/> 
            {useUrl ? 'Direct Link Active (Best Quality)' : 'Optimized for Database Storage'}
         </p>
      )}
    </div>
  );
};

export default AdminPortal;
