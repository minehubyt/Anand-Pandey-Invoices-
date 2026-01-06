
import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle, Receipt, Calendar, CreditCard, Hash, Loader2 } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { InvoiceDetails } from '../../types';
import { InvoicePDF } from './InvoicePDF';

interface InvoiceRendererProps {
  data: InvoiceDetails;
  onClose: () => void;
  mode?: 'invoice' | 'receipt';
}

export const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({ data, onClose, mode = 'invoice' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // --- UPI PAYMENT LOGIC ---
  // Specific ID: 7541076176@ybl
  // This constructs a standard UPI string that opens PhonePe/GPay/Paytm when scanned
  const upiId = "7541076176@ybl";
  const payeeName = "AK Pandey Associates";
  const note = `Inv ${data.invoiceNo}`;
  // Ensure amount is formatted to 2 decimal places for the payment string
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${data.totalAmount.toFixed(2)}&tn=${encodeURIComponent(note)}&cu=INR`;
  
  // Generate QR Image URL using the UPI string
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiString)}&bgcolor=ffffff`;

  const handlePrint = () => {
    document.title = `${mode === 'receipt' ? 'RECEIPT' : 'INVOICE'}_${data.invoiceNo}`;
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // 1. Force the correct mode prop explicitly
      const doc = <InvoicePDF data={data} type={mode} />;
      
      // 2. Generate Blob
      const blob = await pdf(doc).toBlob();
      
      if (!blob) throw new Error("PDF Blob generation returned null");

      // 3. Trigger Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${mode === 'receipt' ? 'Receipt' : 'Invoice'}_${data.invoiceNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("PDF Generation Critical Failure:", error);
      alert(`Document generation failed. Please try again.\nError: ${error?.message || 'Unknown Protocol Error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex justify-center overflow-y-auto py-8 px-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white w-full max-w-[210mm] shadow-2xl relative min-h-[297mm] flex flex-col h-fit animate-reveal-up print:shadow-none print:w-full print:max-w-none print:h-full print:animate-none">
        
        {/* Floating Controls (Don't Print) */}
        <div className="absolute top-0 right-0 p-4 flex gap-2 print:hidden -mr-16">
          <button 
            onClick={handleDownloadPDF} 
            disabled={isGenerating}
            className="p-3 bg-white text-slate-900 hover:bg-[#CC1414] hover:text-white rounded-full transition-colors shadow-lg flex items-center justify-center" 
            title={`Download ${mode === 'receipt' ? 'Receipt' : 'Invoice'}`}
          >
             {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20}/>}
          </button>
          <button 
            onClick={handlePrint} 
            className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-full transition-colors shadow-lg" 
            title="Quick Print"
          >
             <Printer size={20}/>
          </button>
          <button onClick={onClose} className="p-3 bg-white text-slate-400 hover:text-red-600 rounded-full transition-colors shadow-lg">
             <X size={20}/>
          </button>
        </div>

        {/* --- CONTENT START --- */}
        <div className="p-12 md:p-16 flex-1 text-slate-900 font-sans text-sm print:p-[10mm]">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex flex-col">
               <div className="flex items-center font-sans uppercase tracking-[0.15em] text-[#A6192E] font-bold mb-4">
                  <span className="text-2xl leading-none font-serif">AK PANDEY</span>
                  <span className="text-sm mx-1.5 self-center">&</span>
                  <span className="text-2xl leading-none font-serif">ASSOCIATES</span>
               </div>
            </div>
            <div className="text-right text-[10px] leading-relaxed text-slate-600">
               <p className="font-bold text-black text-xs uppercase tracking-wide">AK Pandey & Associates</p>
               <p>High Court Chambers, Shanti Path</p>
               <p>New Delhi, 110001, India</p>
               <p>Tel: +91 11 2345 6789</p>
               <p>Email: finance@anandpandey.in</p>
            </div>
          </div>

          {/* Title & Status */}
          <div className="border-b-2 border-black pb-2 mb-8 flex justify-between items-end">
             <h1 className="text-lg font-bold text-black uppercase tracking-tight">
                {mode === 'receipt' ? 'PAYMENT RECEIPT' : 'PROFESSIONAL FEE INVOICE'}
             </h1>
             {mode === 'receipt' ? (
                <div className="flex items-center gap-2 text-green-700 border border-green-700 px-3 py-1 rounded-sm">
                   <CheckCircle size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">CLEARED</span>
                </div>
             ) : (
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ORIGINAL FOR RECIPIENT</div>
             )}
          </div>

          {/* RECEIPT SPECIFIC HEADER */}
          {mode === 'receipt' && data.payment && (
             <div className="bg-slate-50 p-6 mb-8 border border-slate-100 rounded-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[11px]">
                   <div>
                      <p className="font-bold text-slate-400 uppercase tracking-widest mb-1">Receipt No</p>
                      <p className="font-bold text-black text-sm">RCP-{data.invoiceNo}</p>
                   </div>
                   <div>
                      <p className="font-bold text-slate-400 uppercase tracking-widest mb-1">Date Paid</p>
                      <p className="font-bold text-black text-sm">{new Date(data.payment.date).toLocaleDateString()}</p>
                   </div>
                   <div>
                      <p className="font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Mode</p>
                      <p className="font-bold text-black text-sm">{data.payment.mode}</p>
                   </div>
                   <div>
                      <p className="font-bold text-slate-400 uppercase tracking-widest mb-1">Ref No</p>
                      <p className="font-bold text-black text-sm">{data.payment.transactionReference || 'N/A'}</p>
                   </div>
                </div>
             </div>
          )}

          {/* Details Grid (Invoice Metadata) */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-[12px]">
             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Invoice No.</span>
                <span>: &nbsp; {data.invoiceNo}</span>
             </div>
             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Invoice Date</span>
                <span>: &nbsp; {new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
             </div>

             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Client Name</span>
                <span>: &nbsp; {data.clientName}</span>
             </div>
             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Kind Attn.</span>
                <span>: &nbsp; {data.kindAttn}</span>
             </div>
          </div>

          {/* Full Width Address Block */}
          <div className="mb-10 text-[12px]">
             <p className="font-bold mb-1">Billing Address:</p>
             <p className="leading-relaxed whitespace-pre-line uppercase pl-[108px] -mt-5">{data.clientAddress}</p>
          </div>

          {mode === 'receipt' && (
             <div className="mb-10 text-[13px] leading-relaxed italic text-slate-600 border-l-4 border-slate-200 pl-4 py-2 font-serif">
                "Received with thanks from <strong className="text-black not-italic font-sans">{data.clientName}</strong> a sum of <strong className="text-black not-italic font-sans">INR {data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> towards the full and final settlement of Invoice No. {data.invoiceNo}."
             </div>
          )}

          {/* Line Items Table */}
          <div className="mb-2">
             <table className="w-full text-[12px]">
                <thead>
                   <tr className="text-left border-t-2 border-b-2 border-black bg-slate-50">
                      <th className="py-2 pl-2 font-bold w-16 text-black">S.No.</th>
                      <th className="py-2 font-bold text-black">Particulars</th>
                      <th className="py-2 pr-2 font-bold text-right text-black">Amount (INR)</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                   {data.items.map((item, idx) => (
                      <tr key={idx}>
                         <td className="py-3 pl-2 align-top">{idx + 1}.</td>
                         <td className="py-3 align-top pr-8">
                            <p className="font-bold text-black">{item.description}</p>
                         </td>
                         <td className="py-3 pr-2 align-top text-right font-bold text-black">
                            {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             <div className="border-t-2 border-black w-full"></div>
          </div>

          {/* Total Section */}
          <div className="flex justify-end mb-8 text-[12px]">
             <div className="w-1/2 pt-2">
                <div className="flex justify-between items-center mb-2">
                   <span className="font-bold text-base text-black">{mode === 'receipt' ? 'Amount Received' : 'Gross Amount'}</span>
                   <span className="font-bold text-base text-black">{data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
             </div>
          </div>

          <div className="mb-12 border-b border-slate-200 pb-8 text-[12px]">
             <p className="font-bold text-black uppercase">RUPEES {data.amountInWords}</p>
          </div>

          {/* Footer Terms */}
          <div className="text-[10px] leading-relaxed text-slate-700">
             {mode === 'invoice' ? (
                <>
                   <p className="font-bold mb-2 uppercase text-black">Terms and Conditions</p>
                   <ul className="list-none space-y-1 pl-0 mb-8">
                      {data.terms.map((term, i) => (
                         <li key={i} className="flex gap-2">
                            <span>{String.fromCharCode(97 + i)})</span>
                            <span>{term}</span>
                         </li>
                      ))}
                   </ul>
                </>
             ) : (
                <div className="mb-8">
                   <p className="font-bold mb-1 uppercase text-black">Payment Acknowledgement</p>
                   <p>This is a computer generated receipt. The payment has been credited to the account of AK Pandey & Associates. Subject to realization of Cheques/Drafts.</p>
                </div>
             )}

             {/* Bottom Signature & QR Area */}
             <div className="flex justify-between items-end mt-16">
                <div className="flex flex-col items-center">
                   {/* PAYMENT QR CODE */}
                   <img src={qrUrl} alt="Payment QR" className="w-24 h-24 border border-slate-200 p-1 mb-2" />
                   <span className="text-[8px] font-bold uppercase tracking-widest text-slate-900 bg-slate-100 px-2 py-1 rounded">Scan to Pay via UPI</span>
                </div>

                {mode === 'invoice' && (
                   <div className="text-right">
                      <p className="mb-12 text-slate-500 italic font-serif">This document is digitally signed</p>
                      <p className="font-bold text-black uppercase">For AK Pandey & Associates</p>
                      <p className="text-slate-500 mt-1">Authorized Signatory</p>
                   </div>
                )}
             </div>
          </div>

        </div>
        {/* --- CONTENT END --- */}

        {/* Footer Bar (Print Only) */}
        <div className="hidden print:block fixed bottom-0 w-full text-center text-[8px] text-slate-400 p-4 bg-white">
           Computer Generated {mode === 'receipt' ? 'Receipt' : 'Invoice'} • {data.invoiceNo} • Page 1 of 1
        </div>

      </div>
    </div>
  );
};
