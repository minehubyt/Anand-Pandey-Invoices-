
import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { InvoiceDetails } from '../../types';

interface InvoiceRendererProps {
  data: InvoiceDetails;
  onClose: () => void;
}

export const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({ data, onClose }) => {
  
  // Secure QR Generation: 
  // We encode the data in a custom format that standard scanners won't interpret as a URL or contact.
  // This simulates "only scanned by you".
  const securePayload = btoa(`AKP_SECURE_INVOICE_V1::${data.invoiceNo}::${data.totalAmount}::${data.clientName}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${securePayload}&bgcolor=ffffff`;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white w-full max-w-[850px] shadow-2xl relative min-h-[1100px] flex flex-col h-fit animate-reveal-up">
        
        {/* Floating Controls (Don't Print) */}
        <div className="absolute top-0 right-0 p-4 flex gap-2 print:hidden">
          <button onClick={() => window.print()} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"><Printer size={20}/></button>
          <button onClick={onClose} className="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"><X size={20}/></button>
        </div>

        {/* --- INVOICE CONTENT START --- */}
        <div className="p-12 md:p-16 flex-1 text-slate-900 font-sans text-sm">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex flex-col">
               <div className="flex items-center font-sans uppercase tracking-[0.18em] text-[#A6192E] font-bold mb-4 scale-110 origin-left">
                  <span className="text-3xl leading-none">AK PANDEY</span>
                  <span className="text-lg mx-1.5 self-center">&</span>
                  <span className="text-3xl leading-none">ASSOCIATES</span>
               </div>
            </div>
            <div className="text-right text-[11px] leading-relaxed text-slate-600">
               <p className="font-bold text-black">AK Pandey & Associates</p>
               <p>High Court Chambers, Shanti Path</p>
               <p>New Delhi, 110001, India</p>
               <p>Tel: +91 11 2345 6789</p>
               <p>Email: invoice@anandpandey.in</p>
            </div>
          </div>

          {/* Title */}
          <div className="border-b-2 border-black pb-2 mb-8">
             <h1 className="text-xl font-bold text-black uppercase tracking-tight">Professional Fee Invoice - Original for Recipient</h1>
          </div>

          {/* Details Grid - Compacted Gaps */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-1 mb-10 text-[13px]">
             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Invoice No.</span>
                <span>: &nbsp; {data.invoiceNo}</span>
             </div>
             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Date</span>
                <span>: &nbsp; {new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
             </div>

             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Kind Attn.</span>
                <span>: &nbsp; {data.kindAttn}</span>
             </div>
             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Client Name</span>
                <span>: &nbsp; {data.clientName}</span>
             </div>

             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Mailing Address</span>
                <span className="leading-relaxed whitespace-pre-line uppercase">: &nbsp; {data.mailingAddress}</span>
             </div>
             <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-bold">Address</span>
                <span className="leading-relaxed whitespace-pre-line uppercase">: &nbsp; {data.clientAddress}</span>
             </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-2">
             <table className="w-full">
                <thead>
                   <tr className="text-left border-t-2 border-b-2 border-black">
                      <th className="py-2 font-bold w-16 text-black">S.No.</th>
                      <th className="py-2 font-bold text-black">Particulars</th>
                      <th className="py-2 font-bold text-right text-black">Amount (INR)</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                   {data.items.map((item, idx) => (
                      <tr key={idx}>
                         <td className="py-4 align-top">{idx + 1}.</td>
                         <td className="py-4 align-top pr-8">
                            <p className="font-medium text-black">{item.description}</p>
                         </td>
                         <td className="py-4 align-top text-right font-medium text-black">
                            {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             <div className="border-t-2 border-black w-full"></div>
          </div>

          {/* Total Section */}
          <div className="flex justify-end mb-8">
             <div className="w-1/2 pt-2">
                <div className="flex justify-between items-center mb-2">
                   <span className="font-bold text-lg text-black">Gross Amount</span>
                   <span className="font-bold text-lg text-black">{data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
             </div>
          </div>

          <div className="mb-12 border-b border-slate-200 pb-8">
             <p className="font-bold text-black text-sm uppercase">RUPEES {data.amountInWords}</p>
          </div>

          {/* Terms & Footer */}
          <div className="text-[11px] leading-relaxed text-slate-700">
             <p className="font-bold mb-2 uppercase text-black">Terms and Conditions</p>
             <ul className="list-none space-y-1 pl-0 mb-8">
                {data.terms.map((term, i) => (
                   <li key={i} className="flex gap-2">
                      <span>{String.fromCharCode(97 + i)})</span>
                      <span>{term}</span>
                   </li>
                ))}
             </ul>

             {/* Bottom Signature & QR Area */}
             <div className="flex justify-between items-end mt-16">
                <div className="flex flex-col items-center">
                   <img src={qrUrl} alt="Secure QR" className="w-32 h-32 border border-slate-200 p-1 mb-2" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Secure Verification ID</span>
                </div>

                <div className="text-right">
                   <p className="mb-12 text-slate-500 italic">This document is digitally signed</p>
                   <p className="font-bold text-black uppercase">For AK Pandey & Associates</p>
                   <p className="text-slate-500 mt-1">Authorized Signatory</p>
                </div>
             </div>
          </div>

        </div>
        {/* --- INVOICE CONTENT END --- */}

        {/* Footer Bar (Print Only) */}
        <div className="hidden print:block fixed bottom-0 w-full text-center text-[10px] text-slate-400 p-4 bg-white">
           Computer Generated Invoice • {data.invoiceNo}
        </div>

      </div>
    </div>
  );
};
