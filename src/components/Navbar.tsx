import React from 'react';
import { useRental, ActiveTab } from '../context/RentalContext';
import { Sliders, Sparkles, HelpCircle, Settings, ShoppingBag, Calendar } from 'lucide-react';
import brandLogo from '../assets/images/logo_silence_disco_uithoorn_1793259331317.jpg';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, openBookingModal, pricing } = useRental();

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Sets & Calculator', icon: <Sliders className="w-4 h-4" /> },
    { id: 'beschikbaarheid', label: 'Beschikbaarheid', icon: <Calendar className="w-4 h-4 text-cyan-400" /> },
    { id: 'aanbiedingen', label: 'Aanbiedingen', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'hoe-werkt-het', label: 'Hoe het werkt', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'beheer', label: 'Prijzen & Beheer', icon: <Settings className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand wordmark with circular neon logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0 cursor-pointer"
          >
            <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img
                src={brandLogo}
                alt="Silence Disco Verhuur Uithoorn Logo"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-display whitespace-nowrap">
                Silence <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">Disco</span>
              </span>
              <span className="text-[10px] text-cyan-300 tracking-widest font-bold uppercase whitespace-nowrap">
                Verhuur Uithoorn
              </span>
            </div>
          </button>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/90 text-white shadow-inner border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openBookingModal}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-md shadow-cyan-500/10 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span>Direct Reserveren</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-xs bg-slate-950/20 rounded font-mono font-bold">
                €{pricing.totalIncVat.toFixed(2)}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="md:hidden flex items-center justify-between gap-1 py-2 border-t border-slate-800/50 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                activeTab === link.id
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
