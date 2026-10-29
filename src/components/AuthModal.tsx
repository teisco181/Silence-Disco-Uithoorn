import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { X, User, LogOut, Check, ShieldCheck, Mail, Calendar, MessageSquare } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    userProfile,
    isAdmin,
    handleGoogleLogin,
    handleDemoLogin,
    handleLogout,
    bookings,
    openChatForCustomer,
    setActiveTab,
  } = useRental();

  const [customerNameInput, setCustomerNameInput] = useState('');
  const [customerEmailInput, setCustomerEmailInput] = useState('');

  if (!isAuthModalOpen) return null;

  // Filter bookings for this customer if logged in
  const userBookings = userProfile
    ? bookings.filter((b) => b.email.toLowerCase() === userProfile.email.toLowerCase() || b.userId === userProfile.uid)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {userProfile ? (
          /* Logged In Profile View */
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-cyan-500 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-bold text-white">
                  {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{userProfile.displayName}</h3>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-400 border border-pink-500/30">
                      Beheerder
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono">{userProfile.email}</p>
                <p className="text-[11px] text-cyan-400 mt-0.5">Locatie: Uithoorn en omstreken</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  openChatForCustomer();
                }}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-pink-500/60 rounded-xl text-left transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-pink-400 mb-1" />
                <span className="text-xs font-bold text-white block">Klantenservice Chat</span>
                <span className="text-[10px] text-slate-400">Direct contact met eigenaar</span>
              </button>

              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setActiveTab('beheer');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/60 rounded-xl text-left transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400 mb-1" />
                  <span className="text-xs font-bold text-white block">Beheerpaneel</span>
                  <span className="text-[10px] text-slate-400">Prijzen & producten</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setActiveTab('home');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/60 rounded-xl text-left transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-cyan-400 mb-1" />
                  <span className="text-xs font-bold text-white block">Nieuwe Boeking</span>
                  <span className="text-[10px] text-slate-400">Ophalen in Uithoorn</span>
                </button>
              )}
            </div>

            {/* Customer Bookings section */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Mijn Reserveringen ({userBookings.length})
              </h4>
              {userBookings.length === 0 ? (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500 text-center">
                  Je hebt nog geen eerdere reserveringen geplaatst.
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {userBookings.map((b) => (
                    <div key={b.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white block">#{b.id}</span>
                        <span className="text-[11px] text-slate-400">Feestdatum: {b.eventDate}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-cyan-400 font-bold block">{b.cart.headphonesCount} koptelefoons</span>
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase">Ophalen Uithoorn</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Uitloggen</span>
            </button>
          </div>
        ) : (
          /* Login View */
          <div className="space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Inloggen of Account</h3>
              <p className="text-xs text-slate-400 mt-1">
                Log in om je reserveringen te beheren en live te chatten met Silence Disco Verhuur Uithoorn.
              </p>
            </div>

            {/* Google Login button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold text-xs flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Inloggen met Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase tracking-wider">
                Of direct testen als
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Quick Demo logins */}
            <div className="space-y-3">
              <button
                onClick={() => handleDemoLogin('admin', 'Beheerder Uithoorn', 'teisco181@gmail.com')}
                className="w-full p-3 bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/40 rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Inloggen als Beheerder (Uithoorn)</span>
                  <span className="text-[10px] text-pink-300">Volledige toegang tot prijzen, producten & chat</span>
                </div>
                <ShieldCheck className="w-5 h-5 text-pink-400" />
              </button>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-white block">Direct als Klant inloggen</span>
                <input
                  type="text"
                  placeholder="Jouw naam (bijv. Sanne uit Uithoorn)"
                  value={customerNameInput}
                  onChange={(e) => setCustomerNameInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="email"
                  placeholder="Jouw e-mailadres"
                  value={customerEmailInput}
                  onChange={(e) => setCustomerEmailInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() =>
                    handleDemoLogin(
                      'customer',
                      customerNameInput.trim() || 'Klant Uithoorn',
                      customerEmailInput.trim() || 'klant.uithoorn@gmail.com'
                    )
                  }
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Inloggen als Klant
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
