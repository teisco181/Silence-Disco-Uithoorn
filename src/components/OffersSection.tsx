import React from 'react';
import { useRental } from '../context/RentalContext';
import { Sparkles, Check, ArrowRight, Tag, Settings, Clock, Headphones, Radio } from 'lucide-react';
import specialOfferImg from '../assets/images/silent_disco_special_offer_1793196647101.jpg';

export const OffersSection: React.FC = () => {
  const { offers, applyOffer, setActiveTab } = useRental();

  const activeOffers = offers.filter((o) => o.active);

  return (
    <div className="py-12 sm:py-16 bg-slate-950 text-slate-100 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7 p-8 sm:p-12 z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Exclusieve Silent Disco Voordeelpakketten</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight leading-tight mb-4" style={{ textWrap: 'balance' }}>
                Knallende Aanbiedingen & Combi Deals
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mb-6">
                Profiteer van onze speciale samengestelde sets. Van een gezellig huisfeest met gratis discolamp tot ons legendarische weekendtarief waarbij je 3 dagen huurt voor de prijs van 1 dag!
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Altijd inclusief gratis aansluitkabels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>PostNL heen- en terugverzending</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full relative min-h-[260px]">
              <img
                src={specialOfferImg}
                alt="Silent Disco Feest Aanbiedingen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
            </div>

          </div>
        </div>

        {/* Promo Code Info Strip */}
        <div className="mb-10 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Actieve kortingscodes:</div>
              <div className="text-sm font-semibold text-white">
                Gebruik code <span className="font-mono text-cyan-300 bg-slate-800 px-2 py-0.5 rounded">SILENT10</span> voor 10% extra korting of <span className="font-mono text-pink-300 bg-slate-800 px-2 py-0.5 rounded">STUDENT2026</span> voor €15,- korting
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('beheer')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 rounded-xl hover:bg-emerald-900/60 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Nieuwe Aanbieding Toevoegen</span>
          </button>
        </div>

        {/* Grid of Deal Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {activeOffers.map((offer) => {
            const savings = offer.originalPrice - offer.fixedPrice;
            const savingsPercent = Math.round((savings / offer.originalPrice) * 100);

            return (
              <div
                key={offer.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all border ${
                  offer.popular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-cyan-500/60 shadow-xl shadow-cyan-500/10'
                    : 'bg-slate-900/70 border-slate-800 shadow-lg hover:border-slate-700'
                }`}
              >
                {/* Badge top right */}
                {offer.badge && (
                  <div className="absolute top-6 right-6">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        offer.popular
                          ? 'bg-gradient-to-r from-cyan-400 to-pink-500 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {offer.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Category & Title */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{offer.headphonesCount} Koptelefoons</span>
                    <span aria-hidden="true">·</span>
                    <Radio className="w-3.5 h-3.5 text-pink-400" />
                    <span>{offer.transmittersCount} Zenders</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-2 pr-20">
                    {offer.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-cyan-300 font-medium mb-3">
                    {offer.tagline}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {offer.description}
                  </p>

                  {/* Features bullet list */}
                  <div className="space-y-2 mb-8 pt-4 border-t border-slate-800/80">
                    {offer.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and CTA Card Bottom */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        €{offer.fixedPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-slate-500 line-through font-mono tabular-nums">
                        €{offer.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-semibold">
                      Bespaar €{savings.toFixed(2)} ({savingsPercent}% voordeel)
                    </div>
                  </div>

                  <button
                    onClick={() => applyOffer(offer.id)}
                    className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      offer.popular
                        ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-500/20'
                        : 'bg-white text-slate-950 hover:bg-slate-200'
                    }`}
                  >
                    <span>Kies Dit Pakket</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner: Custom sets */}
        <div className="mt-14 p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold text-white font-display mb-2">
              Liever een specifiek aantal koptelefoons of maatwerk?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              In onze calculator stel je elk willekeurig aantal samen tussen 10 en 350+ stuks met realtime automatische staffelkortingen.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('home')}
            className="px-6 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            Open Calculator
          </button>
        </div>

      </div>
    </div>
  );
};
