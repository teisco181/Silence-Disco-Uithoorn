import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import {
  Sparkles,
  Check,
  Plus,
  Minus,
  Settings,
  Info,
  Tag,
  ArrowRight,
  MapPin,
  Package,
} from 'lucide-react';

export const CalculatorSection: React.FC = () => {
  const {
    settings,
    cart,
    pricing,
    customProducts,
    availabilityCheck,
    setDates,
    setHeadphonesCount,
    setTransmittersCount,
    setRentalDays,
    setIsWeekend,
    setProductCountInCart,
    setPromoCode,
    clearOffer,
    openBookingModal,
    setActiveTab,
    showToast,
    isAdmin,
  } = useRental();

  const [promoInput, setPromoInput] = useState('');

  const quickHeadphonePresets = [15, 25, 50, 75, 100, 150];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoCode(promoInput.trim());
    showToast(`Kortingscode "${promoInput.trim().toUpperCase()}" verwerkt!`);
  };

  const activeCustomProducts = customProducts.filter((p) => p.active);

  return (
    <section id="calculator" className="py-14 sm:py-20 bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-pink-500" />
                Uithoorn & Omstreken
              </span>
              <span aria-hidden="true">·</span>
              <span>Alleen Zelf Ophalen</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Silent Disco Berekenen & Reserveren
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
              Kies het aantal koptelefoons en zenders. Altijd compleet met alle kabels en direct speelklaar af te halen in Uithoorn!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('beheer')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Pas prijzen, producten en voorraad aan"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Prijzen & Producten Beheren</span>
            </button>
          </div>
        </div>

        {/* Applied Offer Banner if present */}
        {cart.appliedOfferId && (
          <div className="mb-8 p-4 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Pakket Deal Actief</p>
                <p className="text-sm font-bold text-white">
                  {pricing.appliedDiscountName || 'Speciaal Pakket Voordeel Toegepast'}
                </p>
              </div>
            </div>
            <button
              onClick={clearOffer}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Terug naar vrije configuratie
            </button>
          </div>
        )}

        {/* 2-Column Grid: Left Controls, Right Order Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Headphone Quantity */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Aantal Koptelefoons
                  </h3>
                </div>
                <div className="text-xs text-slate-400">
                  Totale voorraad Uithoorn:{' '}
                  <span className="font-mono text-cyan-300 font-bold">
                    {settings.totalStockHeadphones} stuks
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Direct Input */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800 mb-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setHeadphonesCount(cart.headphonesCount - 5)}
                    disabled={cart.headphonesCount <= settings.minHeadphones}
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors cursor-pointer"
                    aria-label="Verlaag met 5 koptelefoons"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex items-baseline gap-2">
                    <input
                      type="number"
                      min={settings.minHeadphones}
                      max={settings.totalStockHeadphones}
                      value={cart.headphonesCount}
                      onChange={(e) => setHeadphonesCount(parseInt(e.target.value) || settings.minHeadphones)}
                      className="w-24 text-center text-3xl font-extrabold text-white bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 font-mono tabular-nums focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-sm text-slate-400 font-medium">stuks</span>
                  </div>

                  <button
                    onClick={() => setHeadphonesCount(cart.headphonesCount + 5)}
                    disabled={cart.headphonesCount >= settings.totalStockHeadphones}
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors cursor-pointer"
                    aria-label="Verhoog met 5 koptelefoons"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Live Current Tier price info */}
                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-400">Staffeltarief:</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono tabular-nums">
                    €{pricing.headphonesUnitPrice.toFixed(2)}{' '}
                    <span className="text-xs text-slate-400 font-normal">per stuk</span>
                  </div>
                </div>
              </div>

              {/* Quick Select Presets */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-medium">Snelle selectie aantal feestgangers:</div>
                <div className="flex flex-wrap gap-2">
                  {quickHeadphonePresets.map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setHeadphonesCount(qty)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        cart.headphonesCount === qty
                          ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {qty} personen
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Discount Tiers */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Automatische staffelkortingen per koptelefoon:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {settings.tierPricing.map((tier, idx) => {
                    const isCurrentTier =
                      (tier.maxCount === null && cart.headphonesCount >= tier.minCount) ||
                      (tier.maxCount !== null &&
                        cart.headphonesCount >= tier.minCount &&
                        cart.headphonesCount <= tier.maxCount);

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs transition-all ${
                          isCurrentTier
                            ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                        }`}
                      >
                        <div className="font-semibold text-slate-200">{tier.label}</div>
                        <div className="font-mono text-sm font-bold text-white mt-0.5">
                          €{tier.pricePerHeadphone.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Transmitters / Channels */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Muziekkanalen & Zenders
                    </h3>
                    <p className="text-xs text-slate-400">
                      Elke zender is 1 kanaal. Gasten switchen met 1 druk op de knop tussen de kanalen!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    channels: 1,
                    title: '1 Kanaal (Rood)',
                    subtitle: '1 muziekbron (Spotify of 1 DJ) · Zender inbegrepen',
                    extraCost: 'Inbegrepen in basisprijs',
                    recommended: false,
                  },
                  {
                    channels: 2,
                    title: '2 Kanalen (Rood & Blauw)',
                    subtitle: 'Pop vs. Urban / 2 DJ strijd',
                    extraCost: `+€${settings.pricePerTransmitter.toFixed(2)} extra`,
                    recommended: false,
                  },
                  {
                    channels: 3,
                    title: '3 Kanalen (Rood, Blauw, Groen)',
                    subtitle: 'De ultieme Silent Disco battle!',
                    extraCost: `+€${(settings.pricePerTransmitter * 2).toFixed(2)} extra`,
                    recommended: true,
                  },
                ].map((item) => {
                  const isSelected = cart.transmittersCount === item.channels;
                  return (
                    <button
                      key={item.channels}
                      type="button"
                      onClick={() => setTransmittersCount(item.channels)}
                      className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      {item.recommended && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-pink-500 text-slate-950 rounded">
                          Populair
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white">{item.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <p className="text-xs text-slate-400">{item.subtitle}</p>
                      <div className="mt-3 text-xs font-mono font-semibold text-cyan-300">
                        {item.extraCost}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Alle aansluitkabels (voor smartphone met USB-C / Lightning / mini-jack & DJ-mengpaneel tulp) zijn <strong>altijd gratis meegeleverd</strong>.
                </span>
              </div>
            </div>

            {/* Step 3: Datum & Ophalen in Uithoorn */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Huurperiode & Afhaaldatum Uithoorn
                    </h3>
                    <p className="text-xs text-slate-400">
                      Zelf ophalen & retourneren op onze vaste locatie in Uithoorn.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-lg">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Uithoorn (Wiegerbruinlaan)</span>
                </div>
              </div>

              {/* Quick Period Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRentalDays(3);
                    setIsWeekend(true);
                  }}
                  className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    cart.isWeekend
                      ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 rounded">
                    Weekend Voordeel
                  </span>
                  <div className="font-bold text-sm text-white mb-1">Weekend Huur (Vrij t/m Maandag)</div>
                  <div className="text-xs text-slate-400">Vrijdagmiddag ophalen, zaterdag feesten, maandag ontspannen inleveren voor 1 dagtarief!</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRentalDays(1);
                    setIsWeekend(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    cart.rentalDays === 1 && !cart.isWeekend
                      ? 'bg-slate-900 border-cyan-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">1 Feestdag (Doordeweeks)</div>
                  <div className="text-xs text-slate-400">Ophalen op de feestdag of de dag ervoor, volgende ochtend retour.</div>
                </button>
              </div>

              {/* Date pickers inline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Ophaaldag in Uithoorn
                  </label>
                  <input
                    type="date"
                    value={cart.startDate}
                    onChange={(e) => {
                      setDates(e.target.value, cart.eventDate, cart.returnDate, cart.isWeekend);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 text-cyan-300">
                    Feestdatum *
                  </label>
                  <input
                    type="date"
                    value={cart.eventDate}
                    onChange={(e) => {
                      const newEvent = e.target.value;
                      const d = new Date(newEvent);
                      const isWeekend = d.getDay() === 6 || d.getDay() === 5;
                      setDates(cart.startDate, newEvent, cart.returnDate, isWeekend);
                    }}
                    className="w-full bg-slate-900 border border-cyan-500/70 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Retourdag in Uithoorn
                  </label>
                  <input
                    type="date"
                    value={cart.returnDate}
                    onChange={(e) => {
                      setDates(cart.startDate, cart.eventDate, e.target.value, cart.isWeekend);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Realtime Live Availability Pill */}
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                  availabilityCheck.isAvailable
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>
                    {availabilityCheck.isAvailable ? (
                      <>
                        <strong>Beschikbaar in Uithoorn:</strong> Nog{' '}
                        <span className="font-mono font-bold text-white">
                          {availabilityCheck.minAvailable}
                        </span>{' '}
                        koptelefoons direct vrij voor deze datum!
                      </>
                    ) : (
                      <>
                        <strong>Beperkte voorraad:</strong> Er zijn er nog maximaal{' '}
                        <span className="font-mono font-bold text-white">
                          {availabilityCheck.minAvailable}
                        </span>{' '}
                        beschikbaar.
                      </>
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('beschikbaarheid')}
                  className="text-[11px] underline font-semibold text-slate-200 hover:text-white cursor-pointer whitespace-nowrap"
                >
                  Kalender details
                </button>
              </div>
            </div>

            {/* Step 4: Dynamische Producten Menu (Beheerder Extra's) */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Extra Producten & Opties
                    </h3>
                    <p className="text-xs text-slate-400">
                      Voeg optionele extra's toe aan je reservering (rechtstreeks beheerd door de eigenaar).
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setActiveTab('beheer')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    + Product toevoegen in Beheer
                  </button>
                )}
              </div>

              {activeCustomProducts.length === 0 ? (
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                  <Package className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Standaard complete set inbegrepen:</p>
                    <p className="text-slate-400 mt-0.5">
                      Koptelefoons met LED, 3-kanaals zenders, audio-aansluitkabels en transportbox zijn volledig inbegrepen. Er zijn momenteel geen losse extra's vereist.
                    </p>
                    {isAdmin && (
                      <p className="text-emerald-400 mt-2 font-medium">
                        (Als beheerder kun je via het beheerpaneel nieuwe producten aanmaken met eigen prijs en voorraad)
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCustomProducts.map((prod) => {
                    const countInCart = cart.selectedProducts[prod.id] || 0;
                    return (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800 gap-4 flex-wrap"
                      >
                        <div>
                          <div className="font-bold text-sm text-white">{prod.name}</div>
                          {prod.description && (
                            <div className="text-xs text-slate-400">{prod.description}</div>
                          )}
                          <div className="text-xs text-cyan-400 font-mono mt-0.5">
                            +€{prod.price.toFixed(2)} per stuk · Nog {prod.stock} beschikbaar
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setProductCountInCart(prod.id, countInCart - 1)}
                            disabled={countInCart <= 0}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center text-white cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-white">
                            {countInCart}
                          </span>
                          <button
                            onClick={() => setProductCountInCart(prod.id, countInCart + 1)}
                            disabled={countInCart >= prod.stock}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center text-white cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ophalen Banner */}
              <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/40 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    Zelf Ophalen & Retourneren in Uithoorn (Gratis)
                  </div>
                  <div className="text-xs text-slate-300">
                    Locatie: Wiegerbruinlaan 12, Uithoorn. Exclusief voor Uithoorn en omringende dorpen (De Kwakel, Aalsmeer, Amstelveen, Mijdrecht). Geen verzending per post!
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Summary Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
              
              <div>
                <h3 className="text-lg font-bold text-white font-display">Overzicht Reservering</h3>
                <p className="text-xs text-slate-400">Afhalen in Uithoorn · Direct transparant</p>
              </div>

              {/* Itemized list */}
              <div className="space-y-3 text-xs text-slate-300 border-b border-slate-800 pb-4">
                <div className="flex justify-between items-center">
                  <span>{cart.headphonesCount} × LED-Koptelefoon</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    €{pricing.headphonesSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>{cart.transmittersCount} × Zender (incl. alle kabels)</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    €{pricing.transmittersSubtotal.toFixed(2)}
                  </span>
                </div>

                {pricing.customProductsBreakdown.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>{item.count} × {item.name}</span>
                    <span className="font-mono font-medium text-white tabular-nums">
                      €{item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between items-center text-slate-400">
                  <span>Huurperiode</span>
                  <span>{cart.isWeekend ? 'Weekend (3 dagen)' : `${cart.rentalDays} dag(en)`}</span>
                </div>

                {pricing.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-400 font-semibold bg-emerald-950/30 p-2 rounded-lg">
                    <span>Korting {pricing.appliedDiscountName ? `(${pricing.appliedDiscountName})` : ''}</span>
                    <span className="font-mono tabular-nums">-€{pricing.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-emerald-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Zelf Ophalen in Uithoorn
                  </span>
                  <span className="font-mono font-bold tabular-nums">Gratis (€0,00)</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Borg (100% retour bij inlevering)</span>
                  <span className="font-mono tabular-nums">€{pricing.depositAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo code box */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kortingscode (bijv. UITHOORN10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Toepassen
                </button>
              </form>

              {/* Price per person highlight */}
              <div className="p-3 bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-800/40 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-cyan-300 font-semibold uppercase tracking-wider block">Kosten per persoon:</span>
                  <span className="text-xs text-slate-300">Voor {cart.headphonesCount} personen</span>
                </div>
                <div className="text-lg font-extrabold text-cyan-400 font-mono tabular-nums">
                  €{pricing.pricePerPerson.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">p.p.</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-slate-300">Totaalbedrag:</span>
                  <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                    €{pricing.totalIncVat.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Inclusief 21% BTW</span>
                  <span className="font-mono tabular-nums">€{pricing.vatAmount.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  * Inclusief €{pricing.depositAmount.toFixed(2)} borg (retour bij inlevering in Uithoorn)
                </div>
              </div>

              {/* Primary Reservation CTA Button */}
              <button
                type="button"
                onClick={openBookingModal}
                className="w-full py-4 text-center text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Direct Reserveren (Ophalen Uithoorn)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-400">
                  Vrijblijvend reserveren · Betalen via iDEAL of bij afhalen
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
