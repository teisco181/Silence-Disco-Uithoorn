import React from 'react';
import { useRental } from '../context/RentalContext';
import { Mail, Phone, MapPin, ShieldCheck, MessageSquare } from 'lucide-react';
import brandLogo from '../assets/images/logo_silence_disco_uithoorn_1793259331317.jpg';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsChatDrawerOpen, settings } = useRental();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shrink-0">
                <img
                  src={brandLogo}
                  alt="Silence Disco Verhuur Uithoorn"
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white font-display">
                  Silence Disco
                </span>
                <span className="text-[10px] text-cyan-300 font-semibold uppercase tracking-wider">
                  Verhuur Uithoorn
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Dé specialist in stille disco verhuur voor Uithoorn en directe omstreken. Zelf ophalen & retourneren op onze vaste locatie in Uithoorn.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Lokaal & Betrouwbaar in Uithoorn</span>
            </div>
          </div>

          {/* Snelkoppelingen */}
          <div>
            <h4 className="text-white font-semibold mb-3 font-display text-sm">Snelkoppelingen</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Sets & Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('aanbiedingen')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Pakket Aanbiedingen
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('beschikbaarheid')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Beschikbaarheidskalender
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('hoe-werkt-het')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Hoe Werkt Het?
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('beheer')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Producten & Prijzen Beheren
                </button>
              </li>
            </ul>
          </div>

          {/* Ophalen & Service */}
          <div>
            <h4 className="text-white font-semibold mb-3 font-display text-sm">Zelf Ophalen & Retour</h4>
            <p className="text-slate-400 leading-relaxed text-xs mb-3">
              Geen verzending per post; wij bedienen uitsluitend Uithoorn, De Kwakel, Aalsmeer, Amstelveen en Mijdrecht.
            </p>
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
              <span>{settings.pickupLocationAddress}</span>
            </div>
          </div>

          {/* Contact & Live Chat */}
          <div>
            <h4 className="text-white font-semibold mb-3 font-display text-sm">Klantenservice</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>{settings.companyPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{settings.companyEmail}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsChatDrawerOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-950/40 border border-pink-500/40 text-pink-300 hover:text-white transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Start Live Chat met Ons</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {settings.companyName}. Alle rechten voorbehouden.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Regio Uithoorn en omstreken</span>
            <span aria-hidden="true">·</span>
            <span>Altijd compleet met kabels</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
