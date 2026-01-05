
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface GenericPageProps {
  id?: string;
  onBack: () => void;
}

const GenericPage: React.FC<GenericPageProps> = ({ id, onBack }) => {
  const pageId = id || 'firm-profile';

  const commonStyles = {
    h3: "text-2xl font-serif text-slate-900 mb-4 mt-8",
    p: "mb-6 text-slate-600 font-light leading-relaxed text-lg",
    ul: "list-disc pl-6 mb-6 space-y-2 text-slate-600 font-light text-lg"
  };

  const PAGE_CONTENT: Record<string, { title: string; subtitle?: string; content: React.ReactNode }> = {
    'privacy': {
      title: 'Privacy Policy',
      subtitle: 'Commitment to Data Protection and Confidentiality',
      content: (
        <>
          <p className={commonStyles.p}>At AK Pandey & Associates, we recognize that privacy and confidentiality are the foundations of the legal profession. This Privacy Policy outlines how we handle your personal data in compliance with the Digital Personal Data Protection Act, 2023, and global standards.</p>
          
          <h3 className={commonStyles.h3}>1. Information Collection</h3>
          <p className={commonStyles.p}>We collect information to provide better services to all our users. This includes information you provide to us (such as name, email, and professional details via forms) and information we get from your use of our services.</p>
          
          <h3 className={commonStyles.h3}>2. Use of Information</h3>
          <p className={commonStyles.p}>The information collected is used for internal records, to improve our products and services, and to communicate with you regarding your inquiries or mandates. We strictly do not sell, lease, or distribute your personal information to third parties without your explicit consent.</p>

          <h3 className={commonStyles.h3}>3. Data Security</h3>
          <p className={commonStyles.p}>We employ enterprise-grade encryption (AES-256) and rigorous physical security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. Our 'Mandate Matrix' ensures that client data is siloed and accessible only to authorized counsel.</p>

          <h3 className={commonStyles.h3}>4. Cookies</h3>
          <p className={commonStyles.p}>Our website uses cookies to analyze traffic and improve user experience. You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser setting to decline cookies if you prefer.</p>
        </>
      )
    },
    'disclaimer': {
      title: 'Legal Disclaimer',
      subtitle: 'Bar Council of India Compliance & Terms of Access',
      content: (
         <>
          <div className="bg-slate-50 p-8 border-l-4 border-[#CC1414] mb-12 shadow-sm">
             <p className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-widest">Bar Council of India Rule 36</p>
             <p className="text-slate-600 italic">As per the rules of the Bar Council of India, legal practitioners are not permitted to solicit work or advertise. By accessing this website, you acknowledge the following:</p>
          </div>

          <h3 className={commonStyles.h3}>No Solicitation</h3>
          <p className={commonStyles.p}>By accessing this website, the user acknowledges that there has been no advertisement, personal communication, solicitation, invitation or inducement of any sort whatsoever from us or any of our members to solicit any work through this website.</p>

          <h3 className={commonStyles.h3}>Information Only</h3>
          <p className={commonStyles.p}>The purpose of this website is to provide the user with information about AK Pandey & Associates, its practice areas, and its advocates for their own information. The information provided herein should not be interpreted as legal advice, for which the user must make independent inquiries.</p>

          <h3 className={commonStyles.h3}>No Liability</h3>
          <p className={commonStyles.p}>AK Pandey & Associates is not liable for any consequence of any action taken by the user relying on material / information provided on this website. In cases where the user has any legal issues, he/she in all cases must seek independent legal advice.</p>
         </>
      )
    },
    'compliance': {
      title: 'Regulatory Compliance',
      subtitle: 'Adherence to Global Standards of Practice',
      content: (
        <>
           <h3 className={commonStyles.h3}>Code of Conduct</h3>
           <p className={commonStyles.p}>Our firm strictly adheres to the Standards of Professional Conduct and Etiquette laid down by the Bar Council of India. We maintain the highest levels of integrity, fairness, and courtesy in all our dealings with clients, the court, and opposing counsel.</p>

           <h3 className={commonStyles.h3}>Anti-Bribery & Anti-Corruption</h3>
           <p className={commonStyles.p}>We have a zero-tolerance policy towards bribery and corruption. We comply with the Prevention of Corruption Act, 1988 (India), and adhere to international best practices regarding anti-money laundering (AML) and counter-terrorist financing (CFT).</p>

           <h3 className={commonStyles.h3}>Prevention of Sexual Harassment (POSH)</h3>
           <p className={commonStyles.p}>We are committed to providing a safe, inclusive, and dignified working environment. An Internal Complaints Committee (ICC) is in place in accordance with the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013.</p>

           <h3 className={commonStyles.h3}>Client Confidentiality</h3>
           <p className={commonStyles.p}>All client information is treated with the utmost confidentiality and is protected by attorney-client privilege to the fullest extent permitted by law.</p>
        </>
      )
    },
    'terms': {
       title: 'Terms of Use',
       subtitle: 'Conditions for Accessing this Digital Platform',
       content: (
          <>
           <p className={commonStyles.p}>By accessing this website, you agree to be bound by these Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
           
           <h3 className={commonStyles.h3}>Intellectual Property</h3>
           <p className={commonStyles.p}>All materials on this website, including text, graphics, logos, and images, are the intellectual property of AK Pandey & Associates. Unauthorized reproduction or distribution is strictly prohibited.</p>

           <h3 className={commonStyles.h3}>Usage License</h3>
           <p className={commonStyles.p}>Permission is granted to temporarily download one copy of the materials (information or software) on AK Pandey & Associates' website for personal, non-commercial transitory viewing only.</p>

           <h3 className={commonStyles.h3}>Governing Law</h3>
           <p className={commonStyles.p}>Any claim relating to AK Pandey & Associates' website shall be governed by the laws of the State of Delhi, India without regard to its conflict of law provisions.</p>
          </>
       )
    },
    'firm-profile': {
        title: 'Our Firm Profile',
        subtitle: 'A Legacy of Legal Excellence',
        content: (
            <>
                <p className="text-2xl md:text-3xl font-light text-slate-600 leading-relaxed italic border-l-8 border-slate-50 pl-10 mb-12">
                  Under the stewardship of Advocate Anand Kumar Pandey, our firm has redefined the standards of legal excellence in the South Asian region, blending traditional advocacy with modern strategic innovation.
                </p>
                
                <p className={commonStyles.p}>
                  Our chambers operate on the principle that every client deserves a tailored, high-stakes strategy that anticipates both judicial shifts and regulatory evolution. Whether we are navigating complex cross-border transactions or representing high-profile individuals in constitutional matters, our commitment remains unwavering.
                </p>
                
                <h3 className={commonStyles.h3}>STRATEGIC EXCELLENCE</h3>
                <p className={commonStyles.p}>
                  As a premier boutique law firm based in Delhi and Lucknow, we have built a reputation for handling mandates that other firms find too complex. Our methodology involves a deep dive into the underlying commercial and personal motivations of our clients, ensuring that legal solutions align perfectly with broader objectives.
                </p>
                
                <div className="w-full aspect-video overflow-hidden bg-slate-50 shadow-2xl border border-slate-100 rounded-sm mb-12 my-12">
                  <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                    alt="Professional Office Interior" 
                    className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-[2s] scale-100 hover:scale-105"
                  />
                </div>

                <p className={commonStyles.p}>
                  We believe in the power of knowledge. Our "Thinking" is not just a repository of alerts, but an active research engine that fuels our advocacy. By staying ahead of the curve in sectors like AI regulation, biotechnology, and digital privacy, we provide our clients with a distinct competitive advantage in an increasingly volatile global landscape.
                </p>
            </>
        )
    }
  };

  // Fallback for other pages like 'leadership', 'history' etc. using firm-profile style but generic text if not explicitly defined above
  // For the purpose of this request, we map unknown IDs to a generic template but use the ID as title
  const activeContent = PAGE_CONTENT[pageId] || {
    title: pageId.replace(/-/g, ' ').toUpperCase(),
    subtitle: 'AK Pandey & Associates',
    content: PAGE_CONTENT['firm-profile'].content
  };

  return (
    <div className="pt-32 md:pt-48 pb-32 md:pb-48 animate-fade-in bg-white min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <button 
          onClick={onBack}
          className="flex items-center space-x-3 text-[11px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-[#CC1414] transition-colors mb-20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>BACK TO HOME</span>
        </button>

        <header className="mb-24 max-w-5xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 leading-[1.05] mb-14">
            {activeContent.title}
          </h1>
          {activeContent.subtitle && (
            <p className="text-xl md:text-2xl text-slate-500 font-light mb-8">{activeContent.subtitle}</p>
          )}
          <div className="h-2 w-32 bg-[#CC1414] shadow-sm"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
          <div className="lg:col-span-8">
            <article className="prose prose-slate prose-xl max-w-none text-slate-800 font-light leading-[1.8]">
              {activeContent.content}
            </article>
          </div>

          <div className="lg:col-span-4 space-y-16 shrink-0 h-fit lg:sticky lg:top-32">
             <div className="bg-slate-50 p-12 md:p-14 border border-slate-100 shadow-sm">
                <h4 className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-10 pb-4 border-b border-slate-200">RELATED INFORMATION</h4>
                <ul className="space-y-6">
                  <li><button onClick={() => window.scrollTo(0,0)} className="text-slate-900 hover:text-[#CC1414] font-medium transition-colors text-lg flex items-center group">Top of Page <span className="ml-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">↑</span></button></li>
                  <li><button className="text-slate-900 hover:text-[#CC1414] font-medium transition-colors text-lg flex items-center group">Contact Counsel <span className="ml-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">→</span></button></li>
                </ul>
             </div>

             <div className="p-12 md:p-14 border-2 border-slate-100 group cursor-pointer hover:border-[#CC1414] transition-all bg-white shadow-lg">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#CC1414] mb-6">CONNECT</p>
                <p className="text-3xl font-serif text-slate-900 mb-10 leading-tight">Discuss your specific requirements with our senior counsel.</p>
                <button 
                  onClick={() => onBack()}
                  className="text-xs font-bold tracking-[0.4em] uppercase border-b-2 border-slate-900 pb-2 group-hover:text-[#CC1414] group-hover:border-[#CC1414] transition-all inline-block"
                >
                   BOOK A SESSION
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
