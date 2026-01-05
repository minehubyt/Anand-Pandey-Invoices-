
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, RefreshCw } from 'lucide-react';
import { OFFICES } from '../constants';
import { OfficeLocation as OfficeType } from '../types';

const OfficeLocation: React.FC = () => {
  const [offices, setOffices] = useState<OfficeType[]>(OFFICES);
  const [loading, setLoading] = useState(false);

  // We primarily use the static constants for office locations now for reliability, 
  // but keeping the structure if dynamic loading is needed in future.
  useEffect(() => {
     setOffices(OFFICES);
     setLoading(false);
  }, []);

  return (
    <section id="locations" className="py-32 md:py-48 bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <div className="text-center mb-24">
          <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#CC1414] mb-8 inline-block relative after:content-[''] after:absolute after:bottom-[-12px] after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-px after:bg-[#CC1414]">
            GLOBAL FOOTPRINT
          </h2>
          <h3 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-slate-900 mt-6 font-medium">Strategic Office Locations</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-slate-200" /></div>
        ) : (
          <div className="flex flex-col gap-12">
            {offices.map((office) => (
              <div key={office.id} className="bg-white p-10 md:p-16 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-12 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 group">
                <div className="flex-1">
                  <h4 className="text-3xl font-serif text-slate-900 mb-8 group-hover:text-[#CC1414] transition-colors">{office.city}</h4>
                  <div className="space-y-6">
                    <div className="flex items-start gap-5">
                      <MapPin className="w-6 h-6 text-[#CC1414] shrink-0 mt-1" />
                      <span className="text-slate-600 font-light text-lg leading-relaxed">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      <Phone className="w-6 h-6 text-[#CC1414] shrink-0" />
                      <span className="text-slate-600 font-light text-lg">{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      <Mail className="w-6 h-6 text-[#CC1414] shrink-0" />
                      <span className="text-slate-600 font-light text-lg underline underline-offset-8 decoration-slate-100 hover:decoration-[#CC1414] transition-all">
                        {office.email}
                      </span>
                    </div>
                  </div>
                  {office.locationUrl && (
                    <a 
                      href={office.locationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-12 text-[11px] font-bold tracking-[0.3em] uppercase text-slate-900 border-b-2 border-slate-100 hover:border-[#CC1414] transition-all pb-2 inline-block cursor-pointer"
                    >
                      VIEW ON MAP &rarr;
                    </a>
                  )}
                </div>
                <div className="md:w-6/12 aspect-[16/9] md:aspect-auto h-64 md:h-auto bg-slate-100 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-[2s]">
                  <img 
                     src={office.image || `https://picsum.photos/seed/${office.city}/1600/900`} 
                     alt={`${office.city} architecture`}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-1000"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OfficeLocation;
