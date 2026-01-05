
import React from 'react';

interface DisclaimerModalProps {
  onAcknowledge: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAcknowledge }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 py-8 bg-slate-900/95 backdrop-blur-md transition-all duration-700 animate-fade-in">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-sm animate-reveal-up border-t-4 border-[#CC1414] flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header - Fixed */}
        <div className="bg-white px-8 pt-8 pb-4 flex flex-col items-center text-center shrink-0 z-10">
          <div className="flex items-center font-sans uppercase tracking-[0.18em] text-[#A6192E] font-medium mb-6">
              <span className="text-[16px] leading-none font-medium">AK PANDEY</span>
              <span className="text-[10px] mx-1.5 self-center">&</span>
              <span className="text-[16px] leading-none font-medium">ASSOCIATES</span>
          </div>

          <h2 className="text-slate-900 font-serif text-2xl mb-2">
            Disclaimer
          </h2>
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400 mt-2">Bar Council of India Compliance</p>
        </div>
        
        {/* Content - Scrollable */}
        <div className="px-8 md:px-12 py-2 overflow-y-auto custom-scrollbar flex-1">
          <p className="text-slate-600 font-light leading-relaxed text-sm text-justify mb-5">
            The Bar Council of India does not permit solicitation of work and advertising by legal practitioners and advocates. By accessing the <strong>AK Pandey & Associates</strong> website (our website), the user acknowledges that:
          </p>
          
          <ul className="space-y-3 mb-4">
            {[
              "The user wishes to gain more information about us for his/her information and use. He/She also acknowledges that there has been no attempt by us to advertise or solicit work.",
              "Any information obtained or downloaded by the user from our website does not lead to the creation of the client – attorney relationship between the Firm and the user.",
              "None of the information contained in our website amounts to any form of legal opinion or legal advice.",
              "Our website uses cookies to improve your user experience. By using our site, you agree to our use of cookies.",
              "All information contained in our website is the intellectual property of the Firm."
            ].map((text, idx) => (
              <li key={idx} className="flex gap-3 items-start text-sm text-slate-600 font-light leading-relaxed text-justify">
                 <div className="w-1 h-1 bg-[#CC1414] rounded-full mt-2 shrink-0"></div>
                 <span>{text}</span>
              </li>
            ))}
          </ul>
          
          <div className="pt-4 pb-2 text-center">
             <p className="text-[10px] text-slate-400 italic">
               Please read our Cookies Policy & Privacy Policy for more details.
             </p>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-center shrink-0 z-10">
          <button 
            onClick={onAcknowledge}
            className="w-full md:w-auto px-12 py-3 bg-slate-900 text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#CC1414] transition-all shadow-xl rounded-sm active:scale-95"
          >
            I Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
