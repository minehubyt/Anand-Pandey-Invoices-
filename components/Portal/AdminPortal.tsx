
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, FileText, Settings, LogOut, 
  Plus, Search, Receipt, Mail, MessageCircle, Eye, 
  CheckCircle, X, Banknote, Loader2, Download, RefreshCw 
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { contentService } from '../../services/contentService';
import { emailService } from '../../services/emailService';
import { InvoiceRenderer } from './InvoiceRenderer';
import { InvoicePDF } from './InvoicePDF';
import { UserProfile, ClientDocument, InvoiceDetails, PaymentRecord, Inquiry } from '../../types';

interface AdminPortalProps {
  onLogout: () => void;
}

type Tab = 'dashboard' | 'clients' | 'finance' | 'inquiries';

const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('finance');
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [invoices, setInvoices] = useState<ClientDocument[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [viewInvoice, setViewInvoice] = useState<{data: InvoiceDetails, mode: 'invoice' | 'receipt'} | null>(null);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ClientDocument | null>(null);
  
  // Payment Form State
  const [paymentData, setPaymentData] = useState<PaymentRecord>({
    amountCleared: 0,
    date: new Date().toISOString().split('T')[0],
    mode: 'NEFT/RTGS',
    transactionReference: ''
  });

  useEffect(() => {
    const unsubClients = contentService.getPremierClients((data) => setClients(data));
    const unsubInvoices = contentService.subscribeAllInvoices((data) => setInvoices(data));
    const unsubInquiries = contentService.subscribeInquiries((data) => setInquiries(data));
    
    setLoading(false);

    return () => {
      unsubClients();
      unsubInvoices();
      unsubInquiries();
    };
  }, []);

  const handleSendInvoiceEmail = async (inv: ClientDocument) => {
    if (!inv.invoiceDetails) return;
    setSendingMailId(inv.id);
    try {
        const blob = await pdf(<InvoicePDF data={inv.invoiceDetails} type="invoice" />).toBlob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
             const base64data = (reader.result as string).split(',')[1];
             const clientProfile = await contentService.getUserProfile(inv.userId);
             
             if (clientProfile) {
                 await emailService.sendInvoiceNotification(clientProfile, inv.invoiceDetails!, base64data);
                 alert('Invoice Sent Successfully');
             } else {
                 // Fallback if client profile missing (e.g. manually created invoice without linking)
                 // For now, we assume invoices are linked to users.
                 alert('Client profile not found. Cannot send email.');
             }
             setSendingMailId(null);
        };
    } catch (e) {
        console.error("Email Error:", e);
        alert("Failed to send email.");
        setSendingMailId(null);
    }
  };

  const handleSendWhatsApp = (inv: ClientDocument) => {
    // Construct a message. Ideally, this would link to a public/secure view of the invoice.
    // For now, we'll send a message indicating an invoice has been generated.
    if (!inv.invoiceDetails) return;
    
    const message = `Dear ${inv.invoiceDetails.clientName}, Invoice #${inv.invoiceDetails.invoiceNo} for INR ${inv.invoiceDetails.totalAmount} has been generated. Please check your email or portal for details. - AK Pandey & Associates`;
    
    // User requested manual selection of contact and manual attachment.
    // Opening api.whatsapp.com/send?text=... without phone number triggers contact picker.
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const initiatePaymentRecord = (inv: ClientDocument) => {
      if (!inv.invoiceDetails) return;
      setSelectedInvoice(inv);
      setPaymentData({
          amountCleared: inv.invoiceDetails.totalAmount,
          date: new Date().toISOString().split('T')[0],
          mode: 'NEFT/RTGS',
          transactionReference: ''
      });
      setPaymentModalOpen(true);
  };

  const handleRecordPayment = async () => {
      if (!selectedInvoice || !selectedInvoice.invoiceDetails) return;
      
      try {
          // Update Firestore
          await contentService.updateDocumentStatus(selectedInvoice.id, 'Paid', {
              ...paymentData,
              date: new Date(paymentData.date).toISOString()
          });

          // Send Receipt Email
          if (confirm("Payment recorded. Send receipt to client?")) {
             const updatedDetails = { ...selectedInvoice.invoiceDetails, payment: { ...paymentData, date: new Date(paymentData.date).toISOString() } };
             const blob = await pdf(<InvoicePDF data={updatedDetails} type="receipt" />).toBlob();
             const reader = new FileReader();
             reader.readAsDataURL(blob);
             reader.onloadend = async () => {
                  const base64data = (reader.result as string).split(',')[1];
                  const clientProfile = await contentService.getUserProfile(selectedInvoice.userId);
                  if (clientProfile) {
                      await emailService.sendReceiptNotification(clientProfile, updatedDetails, base64data);
                  }
             };
          }

          setPaymentModalOpen(false);
          setSelectedInvoice(null);
      } catch (err) {
          console.error(err);
          alert("Failed to record payment");
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0B0E] text-white flex-shrink-0 fixed h-full z-20">
        <div className="p-6 border-b border-white/10">
           <div className="flex items-center font-sans uppercase tracking-[0.15em] text-[#A6192E] font-bold text-[13px]">
              ADMIN CONSOLE
           </div>
        </div>
        <nav className="p-4 space-y-2">
           <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'dashboard' ? 'bg-[#CC1414] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <LayoutDashboard size={18} /> Overview
           </button>
           <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'finance' ? 'bg-[#CC1414] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <Banknote size={18} /> Finance
           </button>
           <button onClick={() => setActiveTab('clients')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'clients' ? 'bg-[#CC1414] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <Users size={18} /> Clients
           </button>
           <button onClick={() => setActiveTab('inquiries')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'inquiries' ? 'bg-[#CC1414] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <MessageCircle size={18} /> Inquiries
           </button>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
           <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#CC1414] transition-colors">
              <LogOut size={18} /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
         
         {/* Top Bar */}
         <div className="flex justify-between items-center mb-10">
            <div>
               <h1 className="text-3xl font-serif text-slate-900 capitalize">{activeTab}</h1>
               <p className="text-slate-500 text-sm mt-1">Manage firm operations and client mandates.</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-white p-2 rounded-full shadow-sm text-slate-400"><Search size={20}/></div>
               <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">A</div>
            </div>
         </div>

         {/* View: Finance */}
         {activeTab === 'finance' && (
            <div className="space-y-8 animate-fade-in">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Invoices & Receipts</h3>
                     <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#CC1414] transition-colors">
                        <Plus size={14} /> Create Invoice
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                           <tr>
                              <th className="p-6 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Reference</th>
                              <th className="p-6 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                              <th className="p-6 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Client</th>
                              <th className="p-6 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount</th>
                              <th className="p-6 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                              <th className="p-6 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {invoices.map((inv) => (
                              <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                                 <td className="p-6 text-sm font-bold text-slate-700">{inv.title.replace('Invoice ', '')}</td>
                                 <td className="p-6 text-sm text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                                 <td className="p-6 text-sm text-slate-700">{inv.invoiceDetails?.clientName || 'Unknown'}</td>
                                 <td className="p-6 text-sm font-bold text-right text-slate-900">{inv.amount}</td>
                                 <td className="p-6 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                       {inv.status}
                                    </span>
                                 </td>
                                 <td className="p-6 text-right flex justify-end gap-2">
                                    <button onClick={() => handleSendWhatsApp(inv)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-[10px] font-bold uppercase flex items-center gap-1" title="Send via WhatsApp"><MessageCircle size={14}/></button>
                                    <button onClick={() => handleSendInvoiceEmail(inv)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-200 text-[10px] font-bold uppercase flex items-center gap-1" title="Send Email">{sendingMailId === inv.id ? <Loader2 size={14} className="animate-spin"/> : <Mail size={14}/>}</button>
                                    {inv.status !== 'Paid' && <button onClick={() => initiatePaymentRecord(inv)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-[10px] font-bold uppercase flex items-center gap-1"><Banknote size={14}/> Record Pay</button>}
                                    <button onClick={() => setViewInvoice({data: inv.invoiceDetails!, mode: 'invoice'})} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-[10px] font-bold uppercase flex items-center gap-1"><Eye size={14}/> View</button>
                                    {inv.status === 'Paid' && <button onClick={() => setViewInvoice({data: inv.invoiceDetails!, mode: 'receipt'})} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-[10px] font-bold uppercase flex items-center gap-1"><Receipt size={14}/> Receipt</button>}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         )}

         {/* View: Clients */}
         {activeTab === 'clients' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                 {clients.map(client => (
                     <div key={client.uid} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                         <div className="flex items-center gap-4 mb-6">
                             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-serif text-xl font-bold text-slate-600">
                                 {client.name.charAt(0)}
                             </div>
                             <div>
                                 <h4 className="font-bold text-slate-900">{client.name}</h4>
                                 <p className="text-xs text-slate-500 uppercase tracking-widest">{client.companyName || 'Private Client'}</p>
                             </div>
                         </div>
                         <div className="space-y-2 text-sm text-slate-600 mb-6">
                             <div className="flex items-center gap-3"><Mail size={14} className="text-slate-400"/> {client.email}</div>
                             <div className="flex items-center gap-3"><Users size={14} className="text-slate-400"/> {client.role}</div>
                         </div>
                         <div className="pt-4 border-t border-slate-100 flex gap-2">
                             <button className="flex-1 py-2 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-slate-100">Profile</button>
                             <button className="flex-1 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#CC1414]">Docs</button>
                         </div>
                     </div>
                 ))}
             </div>
         )}
         
         {/* View: Inquiries */}
         {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-fade-in">
               {inquiries.map(inq => (
                  <div key={inq.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                      <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${inq.type === 'rfp' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>{inq.type}</span>
                             <span className="text-xs text-slate-400">{new Date(inq.date).toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-lg font-serif text-slate-900">{inq.name}</h4>
                          <p className="text-sm text-slate-500">{inq.details?.summary || inq.details?.query || 'No details provided'}</p>
                      </div>
                      <button className="px-6 py-2 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-slate-100">Review</button>
                  </div>
               ))}
            </div>
         )}

         {/* Placeholder for Dashboard */}
         {activeTab === 'dashboard' && (
             <div className="text-center py-20 animate-fade-in">
                 <RefreshCw size={48} className="mx-auto text-slate-200 mb-4 animate-spin-slow"/>
                 <p className="text-slate-400 font-serif text-xl">Dashboard Analytics Module</p>
                 <p className="text-slate-300 text-sm mt-2">Under Development</p>
             </div>
         )}

      </main>

      {/* Invoice Modal */}
      {viewInvoice && (
          <InvoiceRenderer 
            data={viewInvoice.data} 
            mode={viewInvoice.mode} 
            onClose={() => setViewInvoice(null)} 
          />
      )}

      {/* Payment Modal */}
      {paymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-reveal-up">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-serif text-slate-900">Record Payment</h3>
                     <button onClick={() => setPaymentModalOpen(false)}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
                 </div>
                 <div className="space-y-4">
                     <div>
                         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount Cleared</label>
                         <input 
                            type="number" 
                            value={paymentData.amountCleared} 
                            onChange={e => setPaymentData({...paymentData, amountCleared: Number(e.target.value)})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#CC1414]"
                         />
                     </div>
                     <div>
                         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</label>
                         <input 
                            type="date" 
                            value={paymentData.date} 
                            onChange={e => setPaymentData({...paymentData, date: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#CC1414]"
                         />
                     </div>
                     <div>
                         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mode</label>
                         <select 
                            value={paymentData.mode} 
                            onChange={e => setPaymentData({...paymentData, mode: e.target.value as any})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#CC1414]"
                         >
                            <option>NEFT/RTGS</option>
                            <option>Cheque</option>
                            <option>UPI</option>
                            <option>Cash</option>
                         </select>
                     </div>
                     <div>
                         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Transaction Ref</label>
                         <input 
                            type="text" 
                            value={paymentData.transactionReference} 
                            onChange={e => setPaymentData({...paymentData, transactionReference: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#CC1414]"
                            placeholder="UTR / Cheque No."
                         />
                     </div>
                     <button 
                        onClick={handleRecordPayment}
                        className="w-full py-4 bg-[#CC1414] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-slate-900 transition-all mt-4"
                     >
                        Confirm Payment
                     </button>
                 </div>
             </div>
          </div>
      )}

    </div>
  );
};

export default AdminPortal;
