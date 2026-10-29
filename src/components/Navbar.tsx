import React from 'react';
import { useRental, ActiveTab } from '../context/RentalContext';
import { Sliders, Sparkles, HelpCircle, Settings, ShoppingBag, Calendar, User, MessageSquare, MapPin } from 'lucide-react';
import brandLogo from '../assets/images/logo_silence_disco_uithoorn_1793259331317.jpg';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openBookingModal,
    pricing,
    userProfile,
    setIsAuthModalOpen,
    setIsChatDrawerOpen,
    unreadChatCount,
  } = useRental();

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Sets & Calculator', icon: <Sliders className="w-4 h-4" /> },
    { id: 'beschikbaarheid', label: 'Beschikbaarheid', icon: <Calendar className="w-4 h-4 text-cyan-400" /> },
    { id: 'aanbiedingen', label: 'Aanbiedingen', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'hoe-werkt-het', label: 'Hoe het werkt', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'beheer', label: 'Prijzen & Beheer', icon: <Settings className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      
      {/* Top Banner: Local Uithoorn Focus */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-pink-950 py-1.5 px-4 text-center border-b border-purple-900/40 text-[11px] sm:text-xs text-purple-200 flex items-center justify-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
        <span>
          <strong>Uitsluitend voor Uithoorn en omstreken:</strong> Altijd zelf gratis ophalen & retourneren (geen postverzending)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          
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

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs xl:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
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

          {/* Zone 3: Account, Chat and Reservation Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Chat icon button */}
            <button
              onClick={() => setIsChatDrawerOpen(true)}
              className="relative p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Open Chat"
            >
              <MessageSquare className="w-4 h-4 text-pink-400" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* Account / Login button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                {userProfile ? userProfile.displayName.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <span className="hidden sm:inline-block max-w-[90px] truncate">
                {userProfile ? userProfile.displayName : 'Inloggen'}
              </span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={openBookingModal}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-md shadow-cyan-500/10 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span>Reserveren</span>
              <span className="hidden xl:inline-block px-1.5 py-0.5 text-xs bg-slate-950/20 rounded font-mono font-bold">
                €{pricing.totalIncVat.toFixed(2)}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile secondary navigation strip */}
        <div className="lg:hidden flex items-center justify-between gap-1 py-2 border-t border-slate-800/50 overflow-x-auto no-scrollbar">
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
