import React from 'react';
import { useRental } from '../context/RentalContext';
import { Sparkles, ArrowRight, ShieldCheck, Truck, VolumeX, Music } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab, openBookingModal } = useRental();

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* Left Column: Hero Editorial & Intent */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean kicker text */}
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-3">
              <span>Silent Disco Verhuur Nederland & België</span>
              <span aria-hidden="true">·</span>
              <span>100% Plug & Play</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-[1.1] mb-6" style={{ textWrap: 'balance' }}>
              De stilste disco.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">
                Het luidste feest.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
              Huur complete silent disco sets met switchbare 3-kanaals LED-koptelefoons voor verjaardagen, studentenfeesten, festivals of bruiloften. Feesten tot in de vroege uurtjes zónder burenklachten.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#calculator"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl transition-all shadow-lg shadow-cyan-500/15 cursor-pointer"
              >
                <span>Bereken Direct Jouw Set</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setActiveTab('aanbiedingen')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Bekijk Pakket Aanbiedingen</span>
              </button>
            </div>

            {/* Proof bar & trust indicators */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>4.9 / 5 Beoordeling</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Gratis retour via PostNL</span>
              </div>
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <VolumeX className="w-4 h-4" />
                </div>
                <span>Nul geluidsoverlast</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 flex items-stretch">
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex flex-col justify-end min-h-[380px] lg:min-h-[460px] group">
              <img
                src="/src/assets/images/hero_silent_disco_party_1793196647405.jpg"
                alt="Mensen feesten met verlichte silent disco koptelefoons"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Overlay card content */}
              <div className="relative p-6 sm:p-8 z-10">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 mb-3">
                  <Music className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3 Kanalen Tegelijk: Rood · Blauw · Groen</span>
                </div>
                <h3 className="text-xl font-bold text-white font-display mb-1">
                  Iedereen danst op zijn eigen favoriete beat
                </h3>
                <p className="text-xs text-slate-300">
                  Geen discussies over de muziekkeuze. Switch met 1 klik van 80s & 90s naar Urban of Hardstyle.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
