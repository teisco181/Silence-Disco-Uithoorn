import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { BookingRecord, PaymentMethod } from '../types/rental';
import { IDEAL_BANKS } from '../data/defaultSettings';
import { formatDutchDate, getAvailabilityForDate } from '../utils/availability';
import {
  X,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Copy,
  Printer,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Lock,
  Building,
  Truck,
  AlertTriangle,
  RotateCcw,
  Check,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    cart,
    setDates,
    pricing,
    availabilityCheck,
    bookings,
    settings,
    addBooking,
    latestConfirmedBooking,
    setLatestConfirmedBooking,
    showToast,
  } = useRental();

  // Multi-step progress: 1 = Dates & Availability, 2 = Customer Info, 3 = Payment, 4 = Confirmed
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: cart.startDate,
    eventDate: cart.eventDate,
    returnDate: cart.returnDate,
    address: '',
    postalCode: '',
    city: '',
    notes: '',
  });

  // Payment states
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('ideal');
  const [selectedBank, setSelectedBank] = useState('ing');
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isBookingModalOpen) return null;

  const handleDateChange = (field: 'startDate' | 'eventDate' | 'returnDate', value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Auto calculate if weekend
    const eventDay = new Date(updated.eventDate).getDay();
    const isWeekend = eventDay === 6 || eventDay === 5 || eventDay === 0;

    setDates(updated.startDate, updated.eventDate, updated.returnDate, isWeekend);
  };

  const handleProceedToDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!availabilityCheck.isAvailable) {
      showToast('Niet voldoende koptelefoons beschikbaar voor deze datum. Pas het aantal aan of kies een andere datum.');
      return;
    }
    setStep(2);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast('Vul alstublieft minimaal je naam, e-mail en telefoonnummer in.');
      return;
    }
    if (cart.deliveryType === 'delivery' && (!formData.address || !formData.postalCode || !formData.city)) {
      showToast('Vul alstublieft het volledige bezorgadres in voor de PostNL verzending.');
      return;
    }
    setStep(3);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setProcessingStatusText('Veilige verbinding maken met betaalserver...');

    setTimeout(() => {
      if (selectedMethod === 'ideal') {
        const bankName = IDEAL_BANKS.find((b) => b.id === selectedBank)?.name || 'iDEAL';
        setProcessingStatusText(`Betaling autoriseren via ${bankName}...`);
      } else if (selectedMethod === 'creditcard') {
        setProcessingStatusText('3D-Secure kaartverificatie uitvoeren...');
      } else {
        setProcessingStatusText('Betaling en factuur verifiëren...');
      }

      setTimeout(() => {
        setProcessingStatusText('Betaling goedgekeurd! Reservering definitief vastleggen...');

        setTimeout(() => {
          setIsProcessingPayment(false);

          const transactionId = `TRX-${selectedMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
          const booking: BookingRecord = {
            id: `SD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            createdAt: new Date().toISOString(),
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            startDate: cart.startDate,
            eventDate: cart.eventDate,
            returnDate: cart.returnDate,
            rentalDays: cart.rentalDays,
            deliveryType: cart.deliveryType,
            address: formData.address,
            postalCode: formData.postalCode,
            city: formData.city,
            notes: formData.notes,
            cart: { ...cart },
            pricingSummary: { ...pricing },
            paymentMethod: selectedMethod,
            paymentStatus: selectedMethod === 'invoice' ? 'pending' : 'paid',
            selectedBank: selectedMethod === 'ideal' ? selectedBank : undefined,
            transactionId,
            orderStatus: 'confirmed',
          };

          addBooking(booking);
        }, 800);
      }, 1200);
    }, 1000);
  };

  const handleCopyReservation = () => {
    if (!latestConfirmedBooking) return;
    const text = `
SilentGroove Reserveringsbevestiging: #${latestConfirmedBooking.id}
Transactie-ID: ${latestConfirmedBooking.transactionId}
Klant: ${latestConfirmedBooking.customerName}
Feestdatum: ${latestConfirmedBooking.eventDate}
Huurperiode: ${latestConfirmedBooking.startDate} t/m ${latestConfirmedBooking.returnDate}
Koptelefoons: ${latestConfirmedBooking.cart.headphonesCount} stuks
Zenders: ${latestConfirmedBooking.cart.transmittersCount} zenders
Betaalmethode: ${latestConfirmedBooking.paymentMethod.toUpperCase()} (Status: ${latestConfirmedBooking.paymentStatus})
Totaalbedrag: €${latestConfirmedBooking.pricingSummary.totalIncVat.toFixed(2)} (incl. €${latestConfirmedBooking.pricingSummary.depositAmount.toFixed(2)} borg)
    `.trim();

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Boekingsdetails gekopieerd naar klembord!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Close button */}
        <button
          onClick={() => {
            setLatestConfirmedBooking(null);
            closeBookingModal();
            setStep(1);
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer z-20"
          aria-label="Sluit venster"
        >
          <X className="w-5 h-5" />
        </button>

        {latestConfirmedBooking ? (
          /* ==============================================================
             STEP 4: CONFIRMATION & INVOICE RECEIPT
             ============================================================== */
          <div className="p-6 sm:p-10 space-y-6">
            
            {/* Header Badge */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Boeking Bevestigd & Betaald
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Bedankt voor je bestelling, {latestConfirmedBooking.customerName.split(' ')[0]}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1">
                  Je betaling via <strong className="text-white uppercase">{latestConfirmedBooking.paymentMethod}</strong> is succesvol verwerkt. We hebben de officiële factuur en bevestiging gestuurd naar <strong className="text-cyan-300">{latestConfirmedBooking.email}</strong>.
                </p>
              </div>
            </div>

            {/* Official Order Slip */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6 text-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <div className="text-[11px] text-slate-500">Boekingsnummer</div>
                  <div className="text-base font-extrabold font-mono text-cyan-400">
                    #{latestConfirmedBooking.id}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Transactie Referentie</div>
                  <div className="font-mono text-slate-300">
                    {latestConfirmedBooking.transactionId}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Status</div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <Check className="w-3 h-3" />
                    <span>Betaald</span>
                  </span>
                </div>
              </div>

              {/* Booking Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-slate-500 block mb-1">Gereserveerde Periode</span>
                  <p className="font-semibold text-white">
                    {formatDutchDate(latestConfirmedBooking.startDate, false)} t/m{' '}
                    {formatDutchDate(latestConfirmedBooking.returnDate, false)}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Feestdatum: {formatDutchDate(latestConfirmedBooking.eventDate)}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Levering & Retour</span>
                  <p className="font-semibold text-white">
                    {latestConfirmedBooking.deliveryType === 'delivery'
                      ? `PostNL Bezorgkoffer (${latestConfirmedBooking.address}, ${latestConfirmedBooking.city})`
                      : 'Zelf ophalen bij vestiging'}
                  </p>
                  <p className="text-emerald-400 text-[11px]">
                    Inclusief voorgedrukt PostNL retourlabel
                  </p>
                </div>
              </div>

              {/* Itemized pricing table */}
              <div className="space-y-2 pt-1 text-slate-300">
                <div className="flex justify-between">
                  <span>{latestConfirmedBooking.cart.headphonesCount} × Silent Disco LED-Koptelefoons</span>
                  <span className="font-mono tabular-nums text-white">
                    €{latestConfirmedBooking.pricingSummary.headphonesSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{latestConfirmedBooking.cart.transmittersCount} × Multi-channel zender met kabels</span>
                  <span className="font-mono tabular-nums text-white">
                    €{latestConfirmedBooking.pricingSummary.transmittersSubtotal.toFixed(2)}
                  </span>
                </div>

                {latestConfirmedBooking.cart.discoLightsCount > 0 && (
                  <div className="flex justify-between">
                    <span>{latestConfirmedBooking.cart.discoLightsCount} × RGB Party Discolamp</span>
                    <span className="font-mono tabular-nums text-white">
                      €{latestConfirmedBooking.pricingSummary.discoLightsSubtotal.toFixed(2)}
                    </span>
                  </div>
                )}

                {latestConfirmedBooking.pricingSummary.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Toegepaste korting</span>
                    <span className="font-mono tabular-nums">
                      -€{latestConfirmedBooking.pricingSummary.discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Verzending & Retour</span>
                  <span className="font-mono tabular-nums text-white">
                    {latestConfirmedBooking.pricingSummary.shippingCost > 0
                      ? `€${latestConfirmedBooking.pricingSummary.shippingCost.toFixed(2)}`
                      : 'Gratis ophalen'}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Borg (wordt automatisch teruggestort na inlevering)</span>
                  <span className="font-mono tabular-nums">
                    €{latestConfirmedBooking.pricingSummary.depositAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                  <span>Totaal Voldaan (incl. 21% BTW)</span>
                  <span className="text-lg font-mono font-extrabold text-cyan-400 tabular-nums">
                    €{latestConfirmedBooking.pricingSummary.totalIncVat.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyReservation}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Gekopieerd!' : 'Kopieer Boekingsbewijs'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Download / Print Factuur</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLatestConfirmedBooking(null);
                  closeBookingModal();
                  setStep(1);
                }}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl transition-colors cursor-pointer"
              >
                Sluiten
              </button>
            </div>

          </div>
        ) : (
          /* ==============================================================
             STEP-BY-STEP CHECKOUT & PAYMENT FLOW
             ============================================================== */
          <div>
            
            {/* Steps Progress Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center justify-between max-w-md mx-auto">
                
                {/* Step 1 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 1
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      step === 1 ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    Datum & Voorraad
                  </span>
                </div>

                <div className="w-8 h-[1px] bg-slate-800" />

                {/* Step 2 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 2
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      step === 2 ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    Klantgegevens
                  </span>
                </div>

                <div className="w-8 h-[1px] bg-slate-800" />

                {/* Step 3 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === 3
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    3
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      step === 3 ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    Betaling
                  </span>
                </div>

              </div>
            </div>

            {/* STEP 1: DATES & AVAILABILITY */}
            {step === 1 && (
              <form onSubmit={handleProceedToDetails} className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Stap 1: Kies Je Feestdatum & Huurperiode
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Wij controleren direct live onze voorraad ({settings.totalStockHeadphones} koptelefoons) voor jouw gekozen data.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Bezorg- / Afhaaldag</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Minimaal 1 dag vóór je feest
                    </span>
                  </div>

                  {/* Event Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-pink-400" />
                      <span>Feestdatum *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) => handleDateChange('eventDate', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      De dag van het feest
                    </span>
                  </div>

                  {/* Return Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Retourdatum</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.returnDate}
                      onChange={(e) => handleDateChange('returnDate', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Afgeven bij PostNL servicepunt
                    </span>
                  </div>
                </div>

                {/* Realtime Live Availability Banner */}
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                    availabilityCheck.isAvailable
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  }`}
                >
                  {availabilityCheck.isAvailable ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}

                  <div className="text-xs space-y-1">
                    <div className="font-bold text-sm text-white">
                      {availabilityCheck.isAvailable
                        ? '100% Beschikbaar & Direct Gegarandeerd'
                        : 'Onvoldoende voorraad op geselecteerde datum'}
                    </div>

                    {availabilityCheck.isAvailable ? (
                      <p className="text-slate-300">
                        Op deze data zijn er nog{' '}
                        <strong className="text-white font-mono font-bold">
                          {availabilityCheck.minAvailable} van de {settings.totalStockHeadphones}
                        </strong>{' '}
                        koptelefoons vrij. Jouw set van{' '}
                        <strong className="text-cyan-300 font-mono font-bold">
                          {cart.headphonesCount} stuks
                        </strong>{' '}
                        kan direct definitief geboekt worden!
                      </p>
                    ) : (
                      <p className="text-rose-200">
                        Op {formatDutchDate(availabilityCheck.bottleneckDate || formData.eventDate)} zijn er nog slechts{' '}
                        <strong className="text-white font-mono">
                          {availabilityCheck.minAvailable}
                        </strong>{' '}
                        koptelefoons beschikbaar (er zijn er al {availabilityCheck.bottleneckBooked} gereserveerd). Verlaag je aantal naar maximaal {availabilityCheck.minAvailable} of kies een andere datum.
                      </p>
                    )}
                  </div>
                </div>

                {/* Summary bar */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Jouw selectie:</span>
                    <span className="font-bold text-white">
                      {cart.headphonesCount} koptelefoons · {cart.transmittersCount} zenders
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Totaalprijs (incl. borg):</span>
                    <span className="text-base font-extrabold font-mono text-cyan-400">
                      €{pricing.totalIncVat.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Next CTA */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={!availabilityCheck.isAvailable}
                    className="px-8 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Volgende: Contact- & Bezorggegevens</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: CUSTOMER & DELIVERY INFO */}
            {step === 2 && (
              <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Stap 2: Contactgegevens & Bezorgadres
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Waar mogen we de set naartoe sturen en de bevestiging naartoe mailen?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Volledige Naam *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bijv. Daniël van de Ven"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>E-mailadres *</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="daniel@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mobiel Telefoonnummer (voor PostNL Track & Trace) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Delivery Address if PostNL */}
                {cart.deliveryType === 'delivery' ? (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <span>PostNL Bezorgadres voor de koffer:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Straatnaam & Huisnummer"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Postcode (1234 AB)"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Woonplaats (bijv. Rotterdam)"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Je hebt gekozen voor <strong>Zelf Ophalen</strong>. De set staat vanaf vrijdag klaar op onze vestiging in Amsterdam, Utrecht of Eindhoven.
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Opmerkingen of specifieke verzoeken (optioneel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="bijv. Verloopkabels voor DJ mixer, bezorging bij de buren indien afwezig..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Terug naar Data</span>
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Volgende: Veilig Betalen</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PAYMENT INTEGRATION */}
            {step === 3 && (
              <form onSubmit={handleExecutePayment} className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Stap 3: Kies Betaalmethode & Afronden
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Veilige SSL 256-bit versleutelde betaling. Je ontvangt direct je boekingsbevestiging.
                  </p>
                </div>

                {/* Payment Methods Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'ideal', label: 'iDEAL', icon: '🏦' },
                    { id: 'creditcard', label: 'Creditcard', icon: '💳' },
                    { id: 'bancontact', label: 'Bancontact', icon: '🇧🇪' },
                    { id: 'invoice', label: 'Op Factuur', icon: '📄' },
                  ].map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-cyan-400 text-white font-bold shadow-md shadow-cyan-500/10'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-lg mb-1">{method.icon}</div>
                        <div className="text-xs">{method.label}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Specific payment method controls */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                  {selectedMethod === 'ideal' && (
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-300">
                        Selecteer je bank voor iDEAL:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {IDEAL_BANKS.map((bank) => (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() => setSelectedBank(bank.id)}
                            className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                              selectedBank === bank.id
                                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-bold'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span>{bank.logo}</span>
                            <span>{bank.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1">
                        Je wordt in de volgende stap veilig doorgestuurd naar je eigen bankomgeving.
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'creditcard' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">Naam Kaarthouder</label>
                        <input
                          type="text"
                          required
                          placeholder="bijv. D. van de Ven"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">Kaartnummer</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="4532 ···· ···· 8921"
                            maxLength={19}
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                          />
                          <CreditCard className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 mb-1 font-semibold">Vervaldatum</label>
                          <input
                            type="text"
                            required
                            placeholder="MM / JJ"
                            maxLength={5}
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 mb-1 font-semibold">CVC Veiligheidscode</label>
                          <input
                            type="password"
                            required
                            placeholder="123"
                            maxLength={4}
                            value={cardData.cvc}
                            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'bancontact' && (
                    <div className="text-xs text-slate-300 space-y-2">
                      <p>
                        Betaal eenvoudig en snel met de Belgische Bancontact app of kaart. Na bevestiging start de veilige Bancontact verificatie.
                      </p>
                    </div>
                  )}

                  {selectedMethod === 'invoice' && (
                    <div className="text-xs text-slate-300 space-y-2">
                      <p>
                        <strong>Betalen op Factuur (14 dagen betaaltermijn):</strong>
                      </p>
                      <p className="text-slate-400">
                        Beschikbaar voor bedrijven, geregistreerde studentenverenigingen, scholen en overheidsinstellingen. Factuur wordt verzonden naar {formData.email}.
                      </p>
                    </div>
                  )}
                </div>

                {/* Final Price Breakdown review */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Huurbedrag ({cart.headphonesCount} koptelefoons)</span>
                    <span className="font-mono tabular-nums text-white">€{pricing.rentalSubtotal.toFixed(2)}</span>
                  </div>

                  {pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Toegepaste korting</span>
                      <span className="font-mono tabular-nums">-€{pricing.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Verzending (PostNL heen & retour)</span>
                    <span className="font-mono tabular-nums text-white">€{pricing.shippingCost.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Borg (teruggestort na inlevering)</span>
                    <span className="font-mono tabular-nums text-white">€{pricing.depositAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-white">Nu te voldoen:</span>
                    <span className="text-xl font-extrabold font-mono text-emerald-400 tabular-nums">
                      €{pricing.totalIncVat.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Processing Overlay if in progress */}
                {isProcessingPayment && (
                  <div className="p-4 bg-slate-950 border border-cyan-500/50 rounded-2xl flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="text-xs font-semibold text-cyan-300 animate-pulse">
                      {processingStatusText}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Terug naar Gegevens</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="px-8 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-40 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Betaal €{pricing.totalIncVat.toFixed(2)} & Bevestig</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Beveiligde betaling via Mollie / Stripe gecertificeerde gateway</span>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
