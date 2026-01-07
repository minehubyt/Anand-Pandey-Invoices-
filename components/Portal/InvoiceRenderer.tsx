
import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle, Receipt, Calendar, CreditCard, Hash, Loader2, Smartphone, ShieldCheck, Ban } from 'lucide-react';
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
  const upiId = "7541076176@ybl";
  const payeeName = "AK Pandey Associates";
  const note = `Inv ${data.invoiceNo}`;
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${Number(data.totalAmount).toFixed(2)}&tn=${encodeURIComponent(note)}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&bgcolor=ffffff`;

  const handlePrint = () => {
    document.title = `${mode === 'receipt' ? 'RECEIPT' : 'INVOICE'}_${data.invoiceNo}`;
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const doc = <InvoicePDF data={data} type={mode} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${mode === 'receipt' ? 'Receipt' : 'Invoice'}_${data.invoiceNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("PDF Generation Failure:", error);
      alert(`Document generation failed.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const dscDate = data.digitalSignature 
    ? new Date(data.digitalSignature.timestamp).toLocaleString('en-GB', { 
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).replace(',', '') + ' +05:30' : '';

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex justify-center overflow-y-auto py-8 px-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white w-full max-w-[210mm] shadow-2xl relative min-h-[297mm] flex flex-col h-fit animate-reveal-up print:shadow-none print:w-full print:max-w-none print:h-full print:animate-none">
        
        {/* Revoked Watermark */}
        {data.isRevoked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden">
            <div className="text-[150px] font-black text-red-500/10 -rotate-45 uppercase border-8 border-red-500/10 px-10">
              Canceled
            </div>
          </div>
        )}

        {/* Floating Controls */}
        <div className="absolute top-0 right-0 p-4 flex gap-2 print:hidden -mr-16">
          <button onClick={handleDownloadPDF} disabled={isGenerating} className="p-3 bg-white text-slate-900 hover:bg-[#CC1414] hover:text-white rounded-full shadow-lg">
             {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20}/>}
          </button>
          <button onClick={handlePrint} className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-full shadow-lg">
             <Printer size={20}/>
          </button>
          <button onClick={onClose} className="p-3 bg-white text-slate-400 hover:text-red-600 rounded-full shadow-lg">
             <X size={20}/>
          </button>
        </div>

        <div className="p-12 md:p-16 flex-1 text-slate-900 font-sans text-sm print:p-[10mm]">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center font-sans uppercase tracking-[0.15em] text-[#A6192E] font-bold mb-4">
              <span className="text-2xl leading-none font-medium">AK PANDEY</span>
              <span className="text-sm mx-1.5 self-center">&</span>
              <span className="text-2xl leading-none font-medium">ASSOCIATES</span>
            </div>
            <div className="text-right text-[10px] leading-relaxed text-slate-600">
               <p className="font-bold text-black text-xs uppercase">AK Pandey & Associates</p>
               <p>High Court Chambers, Shanti Path, New Delhi</p>
               <p>Email: finance@anandpandey.in</p>
            </div>
          </div>

          <div className="border-b border-black pb-2 mb-8 flex justify-between items-end">
             <h1 className="text-lg font-bold text-black uppercase tracking-tight">
                {mode === 'receipt' ? 'PAYMENT RECEIPT' : 'PROFESSIONAL FEE INVOICE'}
             </h1>
             {data.isRevoked ? (
                <div className="flex items-center gap-2 text-red-700 border-2 border-red-700 px-4 py-1 font-bold">
                   <Ban size={14} />
                   <span className="text-xs uppercase tracking-widest">CANCELED</span>
                </div>
             ) : mode === 'receipt' ? (
                <div className="flex items-center gap-2 text-green-700 border border-green-700 px-3 py-1 rounded-sm">
                   <CheckCircle size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">CLEARED</span>
                </div>
             ) : (
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ORIGINAL FOR RECIPIENT</div>
             )}
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-[12px]">
             <div className="grid grid-cols-[100px_1fr] gap-2"><span className="font-bold">Invoice No.</span><span>: &nbsp; {data.invoiceNo}</span></div>
             <div className="grid grid-cols-[100px_1fr] gap-2"><span className="font-bold">Invoice Date</span><span>: &nbsp; {new Date(data.date).toLocaleDateString('en-GB').toUpperCase()}</span></div>
             <div className="grid grid-cols-[100px_1fr] gap-2"><span className="font-bold">Client Name</span><span>: &nbsp; {data.clientName}</span></div>
             <div className="grid grid-cols-[100px_1fr] gap-2"><span className="font-bold">Kind Attn.</span><span>: &nbsp; {data.kindAttn}</span></div>
          </div>

          <div className="mb-2">
             <table className="w-full text-[12px]">
                <thead>
                   <tr className="text-left border-t border-b border-black bg-slate-50">
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
                            {item.itemCode && <span className="text-[9px] text-slate-400 uppercase tracking-widest">CODE: {item.itemCode}</span>}
                         </td>
                         <td className="py-3 pr-2 align-top text-right font-bold text-black">{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          <div className="flex justify-end mb-8 text-[12px]">
             <div className="w-1/2 pt-2">
                <div className="flex justify-between items-center mb-2">
                   <span className="font-bold text-base text-black">{mode === 'receipt' ? 'Amount Received' : 'Gross Amount'}</span>
                   <span className="font-bold text-base text-black">{Number(data.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
             </div>
          </div>

          <div className="mb-12 border-b border-slate-200 pb-8 text-[12px]">
             <p className="font-bold text-black uppercase">RUPEES {data.amountInWords}</p>
          </div>

          {!data.isRevoked && mode === 'invoice' && (
             <div className="grid grid-cols-[1fr_auto] gap-12 items-start mt-8 mb-12">
               <div className="text-[10px] leading-relaxed text-slate-700">
                  <p className="font-bold mb-4 uppercase text-black">Terms and Conditions</p>
                  <ul className="list-none space-y-2 pl-0">
                    {data.terms.map((t, i) => <li key={i} className="flex gap-2"><span>{String.fromCharCode(97 + i)})</span>{t}</li>)}
                  </ul>
               </div>
               <div className="flex flex-col items-center shrink-0">
                  <img src={qrUrl} alt="Payment QR" className="w-40 h-40 border border-slate-200 p-1" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-900 mt-1">Scan to Pay</span>
               </div>
             </div>
          )}

          <div className="flex justify-start mt-8">
             <div className="text-left">
                {data.digitalSignature ? (
                   <div className="relative mt-2 mb-2 p-1 inline-block border border-slate-100 rounded">
                      <div className="text-xs font-bold text-black">Signature valid</div>
                      <div className="text-[8px] text-black">Digitally signed by {data.digitalSignature.signatoryName}</div>
                      <div className="text-[8px] text-black">Date: {dscDate}</div>
                      <div className="absolute top-0 right-[-20px]"><CheckCircle size={24} className="text-green-600"/></div>
                   </div>
                ) : data.signatureImage && <img src={data.signatureImage} className="h-10 mb-2" />}
                <p className="font-bold text-black uppercase">For AK Pandey & Associates</p>
                <p className="text-slate-500 mt-1">Authorized Signatory</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
