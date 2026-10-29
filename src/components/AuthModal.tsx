import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import {
  X,
  User,
  LogOut,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    userProfile,
    isAdmin,
    isAdminUnlocked,
    unlockAdmin,
    lockAdmin,
    handleGoogleLogin,
    loginAsCustomer,
    loginAsAdmin,
    handleLogout,
    bookings,
    openChatForCustomer,
    setActiveTab,
    authError,
    setAuthError,
  } = useRental();

  // Tab inside auth modal if not logged in: 'google' | 'admin' | 'customer'
  const [authView, setAuthView] = useState<'options' | 'admin_credentials'>('options');

  // Customer form inputs (no password required)
  const [customerNameInput, setCustomerNameInput] = useState('');
  const [customerEmailInput, setCustomerEmailInput] = useState('');

  // Admin credentials inputs (requires Teisco181@gmail.com AND Welkom2012*)
  const [adminEmailInput, setAdminEmailInput] = useState('Teisco181@gmail.com');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Second-factor unlock input when logged in as Teisco via Google but not yet unlocked
  const [secondFactorPassword, setSecondFactorPassword] = useState('');
  const [showSecondFactorPassword, setShowSecondFactorPassword] = useState(false);
  const [secondFactorError, setSecondFactorError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  // Filter bookings for this customer if logged in
  const userBookings = userProfile
    ? bookings.filter((b) => b.email.toLowerCase() === userProfile.email.toLowerCase() || b.userId === userProfile.uid)
    : [];

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (!adminEmailInput.trim()) {
      setAdminError('Vul je Google e-mailadres in.');
      return;
    }
    if (!adminPasswordInput.trim()) {
      setAdminError('Vul het extra beheerderswachtwoord in.');
      return;
    }

    const result = loginAsAdmin(adminEmailInput, adminPasswordInput);
    if (!result.success) {
      setAdminError(result.error || 'Inloggen als beheerder mislukt.');
    }
  };

  const handleSecondFactorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecondFactorError(null);

    if (!secondFactorPassword.trim()) {
      setSecondFactorError('Vul het extra beheerderswachtwoord in.');
      return;
    }

    const ok = unlockAdmin(secondFactorPassword.trim());
    if (!ok) {
      setSecondFactorError('Onjuist beheerderswachtwoord. Probeer opnieuw.');
      setSecondFactorPassword('');
    } else {
      setSecondFactorPassword('');
      setIsAuthModalOpen(false);
      setActiveTab('beheer');
    }
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmailInput.trim() && !customerNameInput.trim()) {
      loginAsCustomer('Klant Uithoorn', 'klant.uithoorn@gmail.com');
    } else {
      loginAsCustomer(
        customerNameInput.trim() || 'Klant Uithoorn',
        customerEmailInput.trim() || 'klant.uithoorn@gmail.com'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setAuthError(null);
            setAdminError(null);
          }}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {userProfile ? (
          /* ============================================================
             INGELOGD PROFIEL OVERZICHT
             ============================================================ */
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
                  {isAdmin ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-400 border border-pink-500/30">
                      Beheerder
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      Klant
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono">{userProfile.email}</p>
                <p className="text-[11px] text-cyan-400 mt-0.5">Locatie: Uithoorn en omstreken</p>
              </div>
            </div>

            {/* If user is Admin (Teisco181@gmail.com), check second-factor unlock state */}
            {isAdmin && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-pink-400" />
                    <span>Beheerder Status:</span>
                  </div>
                  {isAdminUnlocked ? (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Ontgrendeld
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Extra wachtwoord vereist
                    </span>
                  )}
                </div>

                {!isAdminUnlocked ? (
                  <form onSubmit={handleSecondFactorSubmit} className="space-y-2 pt-1">
                    <p className="text-[11px] text-slate-400">
                      Vul je extra beheerderswachtwoord in om het instellingenpaneel te ontgrendelen:
                    </p>
                    <div className="relative">
                      <input
                        type={showSecondFactorPassword ? 'text' : 'password'}
                        value={secondFactorPassword}
                        onChange={(e) => {
                          setSecondFactorPassword(e.target.value);
                          setSecondFactorError(null);
                        }}
                        placeholder="Voer extra wachtwoord in (Welkom2012*)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 pr-9 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecondFactorPassword(!showSecondFactorPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showSecondFactorPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {secondFactorError && (
                      <p className="text-[11px] text-rose-400 font-semibold">{secondFactorError}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      Ontgrendel Beheerpaneel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setActiveTab('beheer');
                      }}
                      className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Open Prijzen & Beheer
                    </button>
                    <button
                      type="button"
                      onClick={lockAdmin}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                      title="Vergrendel paneel"
                    >
                      Vergrendel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions for everyone */}
            <div className="grid grid-cols-2 gap-3 pt-1">
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

              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setActiveTab(isAdmin && isAdminUnlocked ? 'beheer' : 'home');
                }}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/60 rounded-xl text-left transition-all cursor-pointer"
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-cyan-400 mb-1" />
                    <span className="text-xs font-bold text-white block">Beheerpaneel</span>
                    <span className="text-[10px] text-slate-400">Prijzen & instellingen</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-cyan-400 mb-1" />
                    <span className="text-xs font-bold text-white block">Sets & Prijzen</span>
                    <span className="text-[10px] text-slate-400">Ophalen in Uithoorn</span>
                  </>
                )}
              </button>
            </div>

            {/* Customer Bookings section */}
            {!isAdmin && (
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
            )}

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
          /* ============================================================
             NIET INGELOGD: GOOGLE LOGIN & BEHEERDER VERIFICATIE
             ============================================================ */
          <div className="space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Inloggen op je Account</h3>
              <p className="text-xs text-slate-400 mt-1">
                Log in via Google. Klanten kunnen direct inloggen zonder extra wachtwoord. Voor het beheerdersaccount is het extra wachtwoord vereist.
              </p>
            </div>

            {/* Diagnostic alert if Google sign-in failed */}
            {authError && (
              <div className="p-3 bg-amber-950/50 border border-amber-500/50 rounded-xl text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Google Inloggen Melding</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/90">{authError}</p>
              </div>
            )}

            {/* Primary Google Login button */}
            <button
              type="button"
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
                Of kies accounttype
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* TAB SELECTOR: BEHEERDER VS KLANT */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setAuthView('options')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authView === 'options'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Klant Account
              </button>
              <button
                type="button"
                onClick={() => setAuthView('admin_credentials')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authView === 'admin_credentials'
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-pink-400 hover:text-pink-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Beheerder (Teisco)</span>
              </button>
            </div>

            {/* SECTION 1: BEHEERDER INLOGGEN (Vereist Teisco181@gmail.com én Welkom2012*) */}
            {authView === 'admin_credentials' && (
              <form onSubmit={handleAdminSubmit} className="p-4 bg-slate-950 border border-pink-500/40 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-bold text-white">Beheerdersverificatie (2-Staps)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Om toegang te krijgen als beheerder moet je Google e-mailadres <strong>Teisco181@gmail.com</strong> zijn en het extra wachtwoord worden ingevoerd.
                </p>

                {adminError && (
                  <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{adminError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Google E-mailadres
                  </label>
                  <input
                    type="email"
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    placeholder="Teisco181@gmail.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-400 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Extra Beheerderswachtwoord
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPasswordInput}
                      onChange={(e) => {
                        setAdminPasswordInput(e.target.value);
                        if (adminError) setAdminError(null);
                      }}
                      placeholder="Voer extra wachtwoord in"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-400 pr-9 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-pink-500/20"
                >
                  Verifiëren & Inloggen als Beheerder
                </button>
              </form>
            )}

            {/* SECTION 2: KLANT INLOGGEN (Geen extra wachtwoord nodig) */}
            {authView === 'options' && (
              <form onSubmit={handleCustomerSubmit} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white block">Direct als Klant inloggen</span>
                  <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Geen wachtwoord nodig
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Klanten hoeven geen wachtwoord te onthouden. Vul je naam en e-mailadres in om je reserveringen te volgen en live te chatten.
                </p>

                <input
                  type="text"
                  placeholder="Jouw naam (bijv. Sophie uit Uithoorn)"
                  value={customerNameInput}
                  onChange={(e) => setCustomerNameInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="email"
                  placeholder="Jouw e-mailadres (bijv. sophie@kdo.nl)"
                  value={customerEmailInput}
                  onChange={(e) => setCustomerEmailInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-cyan-500/10"
                >
                  Inloggen als Klant
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
