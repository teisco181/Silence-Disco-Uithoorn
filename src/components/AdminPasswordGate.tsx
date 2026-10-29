import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  LogIn,
  UserX,
} from 'lucide-react';

export const AdminPasswordGate: React.FC = () => {
  const {
    unlockAdmin,
    setActiveTab,
    isAdmin,
    userProfile,
    settings,
    setIsAuthModalOpen,
  } = useRental();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setError('Voer eerst het extra beheerderswachtwoord in.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const success = unlockAdmin(passwordInput.trim());
    setIsSubmitting(false);

    if (!success) {
      setError('Onjuist wachtwoord. Controleer het wachtwoord en probeer het opnieuw.');
      setPasswordInput('');
    }
  };

  const isTeiscoLoggedIn =
    Boolean(userProfile?.email && userProfile.email.toLowerCase() === 'teisco181@gmail.com') || isAdmin;

  return (
    <div className="py-16 sm:py-24 bg-slate-950 min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Icon & Badge */}
        <div className="text-center relative z-10 mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-slate-800 to-cyan-500/20 border border-slate-700/80 flex items-center justify-center text-pink-400 shadow-lg shadow-pink-500/10">
            <Lock className="w-8 h-8 text-pink-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-semibold text-pink-400 uppercase tracking-wider mb-2">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Beheerderspaneel Beveiligd</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Instellingen & Prijzen
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Dit menu is uitsluitend bestemd voor <strong>Silence Disco Verhuur Uithoorn (Teisco)</strong>.
          </p>
        </div>

        {/* STAP 1 CHECK: Is de gebruiker ingelogd met Google als Teisco181@gmail.com? */}
        {!isTeiscoLoggedIn ? (
          <div className="space-y-5 relative z-10 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                <UserX className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Stap 1: Inloggen als Beheerder</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Je moet eerst inloggen met het Google e-mailadres:
                <br />
                <strong className="text-pink-400 font-mono text-xs">Teisco181@gmail.com</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Inloggen met Teisco181@gmail.com</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Terug naar Sets & Calculator</span>
              </button>
            </div>
          </div>
        ) : (
          /* STAP 2: Ingelogd als Teisco -> Extra beheerderswachtwoord invullen */
          <div className="space-y-5 relative z-10 animate-fadeIn">
            <div className="p-3.5 bg-pink-950/20 border border-pink-500/30 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-pink-400 shrink-0" />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">
                    {userProfile?.displayName || 'Teisco'}
                  </span>
                  <span className="text-[11px] text-pink-300 font-mono">Teisco181@gmail.com (Stap 1 OK)</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Geverifieerd
              </span>
            </div>

            {/* Error notification */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Stap 2: Extra Beheerderswachtwoord
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (error) setError(null);
                    }}
                    autoFocus
                    placeholder="Voer extra wachtwoord in..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-colors pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded transition-colors"
                    title={showPassword ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/20 active:scale-[0.99]"
              >
                <Unlock className="w-4 h-4" />
                <span>{isSubmitting ? 'Verifiëren...' : 'Beheerpaneel Ontgrendelen'}</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Terug naar Sets & Calculator</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
