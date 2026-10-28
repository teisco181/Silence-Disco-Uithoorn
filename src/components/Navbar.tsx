import React from 'react';
import { useRental, ActiveTab } from '../context/RentalContext';
import { Headphones, Sliders, Sparkles, HelpCircle, Settings, ShoppingBag } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, openBookingModal, pricing, cart } = useRental();

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Sets & Calculator', icon: <Sliders className="w-4 h-4" /> },
    { id: 'aanbiedingen', label: 'Aanbiedingen', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'hoe-werkt-het', label: 'Hoe het werkt', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'beheer', label: 'Prijzen & Beheer', icon: <Settings className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text element wordmark with logo mark */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Headphones className="w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white font-display whitespace-nowrap">
                Silent<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">Groove</span>
              </span>
              <span className="text-[11px] text-slate-400 tracking-wider font-medium uppercase whitespace-nowrap">
                Silent Disco Verhuur
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
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
              <span>Reserveer Set</span>
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
