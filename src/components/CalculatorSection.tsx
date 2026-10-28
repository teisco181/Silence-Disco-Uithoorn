import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import {
  Headphones,
  Radio,
  Calendar,
  Sparkles,
  Truck,
  Check,
  Plus,
  Minus,
  Settings,
  Info,
  Tag,
  Zap,
  ArrowRight,
} from 'lucide-react';

export const CalculatorSection: React.FC = () => {
  const {
    settings,
    cart,
    pricing,
    availabilityCheck,
    setDates,
    setHeadphonesCount,
    setTransmittersCount,
    setRentalDays,
    setIsWeekend,
    setDiscoLightsCount,
    setPowerbanksCount,
    setDeliveryType,
    setPromoCode,
    clearOffer,
    openBookingModal,
    setActiveTab,
    showToast,
  } = useRental();

  const [promoInput, setPromoInput] = useState('');

  const quickHeadphonePresets = [15, 25, 50, 75, 100, 150];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoCode(promoInput.trim());
    showToast(`Kortingscode "${promoInput.trim().toUpperCase()}" verwerkt!`);
  };

  return (
    <section id="calculator" className="py-14 sm:py-20 bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2">
              <span>Stel Zelf Samen</span>
              <span aria-hidden="true">·</span>
              <span>Realtime Tariefberekening</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Silent Disco Set Configurator
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
              Kies het aantal koptelefoons, gewenste zenders en accessoires. Hoe groter je groep, hoe lager de prijs per persoon!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('beheer')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900/60 transition-colors whitespace-nowrap shrink-0"
              title="Pas de basisprijzen, voorraad en staffels aan"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Prijzen & Voorraad Aanpassen</span>
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
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Aanbieding Actief</p>
                <p className="text-sm font-bold text-white">
                  {pricing.appliedDiscountName || 'Speciaal Pakket Voordeel Toegepast'}
                </p>
              </div>
            </div>
            <button
              onClick={clearOffer}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Terug naar handmatige configuratie
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
                  Beschikbaar in voorraad:{' '}
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
                  <div className="text-xs text-slate-400">Huidige staffelprijs:</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono tabular-nums">
                    €{pricing.headphonesUnitPrice.toFixed(2)}{' '}
                    <span className="text-xs text-slate-400 font-normal">per stuk / dag</span>
                  </div>
                </div>
              </div>

              {/* Quick Select Presets */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-medium">Snelle selectie populaire groepsgroottes:</div>
                <div className="flex flex-wrap gap-2">
                  {quickHeadphonePresets.map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setHeadphonesCount(qty)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        cart.headphonesCount === qty
                          ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {qty} gasten
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Discount Tiers table preview */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Volumekorting staffels (automatisch verrekend):</span>
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
                      Aantal Muziekkanalen & Zenders
                    </h3>
                    <p className="text-xs text-slate-400">
                      Elke zender creëert 1 apart muziekkanaal met eigen LED kleur op de koptelefoons.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  €{settings.pricePerTransmitter.toFixed(2)} per zender
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    channels: 1,
                    title: '1 Kanaal (Rood)',
                    subtitle: '1 muziekbron (Spotify of 1 DJ)',
                    recommended: false,
                  },
                  {
                    channels: 2,
                    title: '2 Kanalen (Rood + Blauw)',
                    subtitle: 'Pop vs. Urban / 2 DJ strijd',
                    recommended: false,
                  },
                  {
                    channels: 3,
                    title: '3 Kanalen (Rood, Blauw & Groen)',
                    subtitle: 'De ultieme Silent Disco battle!',
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
                      <div className="mt-3 text-xs font-mono font-semibold text-slate-300">
                        {item.channels} × zender incl. kabels
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Alle benodigde aansluitkabels (voor smartphones met USB-C / Lightning, mini-jack & DJ mengpaneel tulp) zijn <strong>altijd gratis inbegrepen</strong>.
                </span>
              </div>
            </div>

            {/* Step 3: Huurperiode, Datum & Beschikbaarheid */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Huurperiode, Feestdatum & Beschikbaarheid
                    </h3>
                    <p className="text-xs text-slate-400">
                      Kies je feestdatum. Wij reserveren de koffer tijdig voor jouw evenement.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('beschikbaarheid')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded-lg hover:bg-cyan-900/60 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Open Kalender</span>
                </button>
              </div>

              {/* Quick Period Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <div className="font-bold text-sm text-white mb-1">1 Feestdag</div>
                  <div className="text-xs text-slate-400">Voor doordeweekse borrels of eendaags event</div>
                </button>

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
                    3 Dagen = 1 Dag Prijs
                  </span>
                  <div className="font-bold text-sm text-white mb-1">Weekend Huuractie</div>
                  <div className="text-xs text-slate-400">Vrijdag in huis, zaterdag feesten, maandag pas retour</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRentalDays(2);
                    setIsWeekend(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    cart.rentalDays === 2 && !cart.isWeekend
                      ? 'bg-slate-900 border-cyan-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">2 Dagen</div>
                  <div className="text-xs text-slate-400">Twee aaneengesloten doordeweekse dagen</div>
                </button>
              </div>

              {/* Date pickers inline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Bezorg-/Afhaaldag
                  </label>
                  <input
                    type="date"
                    value={cart.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      const eventDay = new Date(cart.eventDate);
                      setDates(newStart, cart.eventDate, cart.returnDate, cart.isWeekend);
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
                    Retourdag (PostNL)
                  </label>
                  <input
                    type="date"
                    value={cart.returnDate}
                    onChange={(e) => {
                      const newRet = e.target.value;
                      setDates(cart.startDate, cart.eventDate, newRet, cart.isWeekend);
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
                        <strong>Live Beschikbaar:</strong> Nog{' '}
                        <span className="font-mono font-bold text-white">
                          {availabilityCheck.minAvailable}
                        </span>{' '}
                        koptelefoons vrij voor deze datum!
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

            {/* Step 4: Accessoires & Bezorging */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  Optionele Accessoires & Bezorgwijze
                </h3>
              </div>

              {/* Discolampen */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800 gap-4">
                <div>
                  <div className="font-bold text-sm text-white">Roterende RGB Party Discolamp</div>
                  <div className="text-xs text-slate-400">
                    Vult de hele woonkamer of partytent met kleurrijke dansende lichtbundels (+€{settings.pricePerDiscoLight.toFixed(2)} per stuk)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDiscoLightsCount(cart.discoLightsCount - 1)}
                    disabled={cart.discoLightsCount <= 0}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-white">
                    {cart.discoLightsCount}
                  </span>
                  <button
                    onClick={() => setDiscoLightsCount(cart.discoLightsCount + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Powerbanks voor buiten */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800 gap-4">
                <div>
                  <div className="font-bold text-sm text-white">Outdoor Accu / Powerbank voor Zender</div>
                  <div className="text-xs text-slate-400">
                    Maakt de zenders 100% draadloos voor feesten in het park, strand of bos (+€{settings.pricePowerbank.toFixed(2)} per stuk)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPowerbanksCount(cart.powerbanksCount - 1)}
                    disabled={cart.powerbanksCount <= 0}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-white">
                    {cart.powerbanksCount}
                  </span>
                  <button
                    onClick={() => setPowerbanksCount(cart.powerbanksCount + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Delivery method toggle */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-300 mb-2">Bezorging of afhalen:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      cart.deliveryType === 'delivery'
                        ? 'bg-slate-900 border-cyan-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm text-white">PostNL Heen & Retour (+€{settings.shippingCostRoundtrip.toFixed(2)})</div>
                      <div className="text-xs text-slate-400">Stevige koffer bezorgd aan huis incl. voorgedrukt retourlabel</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      cart.deliveryType === 'pickup'
                        ? 'bg-slate-900 border-cyan-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm text-white">Zelf Ophalen (Gratis)</div>
                      <div className="text-xs text-slate-400">Afhaalpunt in Amsterdam, Utrecht of Eindhoven</div>
                    </div>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Right Summary Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
              
              <div>
                <h3 className="text-lg font-bold text-white font-display">Overzicht Reservering</h3>
                <p className="text-xs text-slate-400">Direct inzicht in alle kosten</p>
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

                {cart.discoLightsCount > 0 && (
                  <div className="flex justify-between items-center">
                    <span>{cart.discoLightsCount} × RGB Discolamp</span>
                    <span className="font-mono font-medium text-white tabular-nums">
                      €{pricing.discoLightsSubtotal.toFixed(2)}
                    </span>
                  </div>
                )}

                {cart.powerbanksCount > 0 && (
                  <div className="flex justify-between items-center">
                    <span>{cart.powerbanksCount} × Powerbank</span>
                    <span className="font-mono font-medium text-white tabular-nums">
                      €{pricing.powerbanksSubtotal.toFixed(2)}
                    </span>
                  </div>
                )}

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

                <div className="flex justify-between items-center">
                  <span>Bezorging & Retour</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    {pricing.shippingCost > 0 ? `€${pricing.shippingCost.toFixed(2)}` : 'Gratis ophalen'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Borg (100% retour na inlevering)</span>
                  <span className="font-mono tabular-nums">€{pricing.depositAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo code box */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kortingscode (bijv. SILENT10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Toepassen
                </button>
              </form>

              {/* Price per person highlight */}
              <div className="p-3 bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-800/40 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-cyan-300 font-semibold uppercase tracking-wider block">Kosten per persoon:</span>
                  <span className="text-xs text-slate-300">Gebaseerd op {cart.headphonesCount} gasten</span>
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
                  <span>Waarvan 21% BTW</span>
                  <span className="font-mono tabular-nums">€{pricing.vatAmount.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  * Inclusief €{pricing.depositAmount.toFixed(2)} borg (volledig teruggestort na inlevering)
                </div>
              </div>

              {/* Primary Reservation CTA Button */}
              <button
                type="button"
                onClick={openBookingModal}
                className="w-full py-4 text-center text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Direct Reserveren</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-400">
                  Vrijblijvende optie · Geen directe betaling verplicht
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
