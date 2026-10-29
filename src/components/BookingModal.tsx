import React, { useState, useEffect } from 'react';
import { useRental } from '../context/RentalContext';
import { BookingRecord, PaymentMethod } from '../types/rental';
import { IDEAL_BANKS } from '../data/defaultSettings';
import { formatDutchDate } from '../utils/availability';
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
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Building,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';
import brandLogo from '../assets/images/logo_silence_disco_uithoorn_1793259331317.jpg';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    cart,
    setDates,
    pricing,
    availabilityCheck,
    settings,
    addBooking,
    latestConfirmedBooking,
    setLatestConfirmedBooking,
    showToast,
    userProfile,
  } = useRental();

  // Multi-step progress: 1 = Dates & Stock, 2 = Customer Info & Afhaalmoment, 3 = Payment, 4 = Confirmed
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [formData, setFormData] = useState({
    name: userProfile?.displayName || '',
    email: userProfile?.email || '',
    phone: '',
    city: 'Uithoorn',
    pickupTimeSlot: 'Vrijdag 16:00 - 17:30 uur',
    startDate: cart.startDate,
    eventDate: cart.eventDate,
    returnDate: cart.returnDate,
    notes: '',
  });

  // Sync profile if user logs in
  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || userProfile.displayName,
        email: prev.email || userProfile.email,
      }));
    }
  }, [userProfile]);

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

    const eventDay = new Date(updated.eventDate).getDay();
    const isWeekend = eventDay === 6 || eventDay === 5 || eventDay === 0;

    setDates(updated.startDate, updated.eventDate, updated.returnDate, isWeekend);
  };

  const handleProceedToDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!availabilityCheck.isAvailable) {
      showToast('Niet voldoende koptelefoons beschikbaar voor deze datum.');
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
    setStep(3);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setProcessingStatusText('Reservering voorbereiden voor ophalen in Uithoorn...');

    setTimeout(() => {
      if (selectedMethod === 'ideal') {
        const bankName = IDEAL_BANKS.find((b) => b.id === selectedBank)?.name || 'iDEAL';
        setProcessingStatusText(`Betaling autoriseren via ${bankName}...`);
      } else if (selectedMethod === 'creditcard') {
        setProcessingStatusText('3D-Secure verificatie uitvoeren...');
      } else if (selectedMethod === 'cash_at_pickup') {
        setProcessingStatusText('Afspraak registreren voor betaling bij afhalen...');
      } else {
        setProcessingStatusText('Factuur genereren...');
      }

      setTimeout(() => {
        setProcessingStatusText('Reservering definitief vastgelegd in Uithoorn!');

        setTimeout(() => {
          setIsProcessingPayment(false);

          const transactionId = `TRX-${selectedMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
          const booking: BookingRecord = {
            id: `SD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            userId: userProfile?.uid,
            createdAt: new Date().toISOString(),
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city || 'Uithoorn',
            pickupTimeSlot: formData.pickupTimeSlot,
            startDate: cart.startDate,
            eventDate: cart.eventDate,
            returnDate: cart.returnDate,
            rentalDays: cart.rentalDays,
            deliveryType: 'pickup',
            notes: formData.notes,
            cart: { ...cart },
            pricingSummary: { ...pricing },
            paymentMethod: selectedMethod,
            paymentStatus: selectedMethod === 'invoice' || selectedMethod === 'cash_at_pickup' ? 'pending' : 'paid',
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
Silence Disco Verhuur Uithoorn - Reservering: #${latestConfirmedBooking.id}
Locatie: Wiegerbruinlaan 12, 1422 CB Uithoorn
Klant: ${latestConfirmedBooking.customerName} (${latestConfirmedBooking.phone})
Afhaalmoment: ${latestConfirmedBooking.pickupTimeSlot || 'In overleg'}
Feestdatum: ${latestConfirmedBooking.eventDate}
Aantal koptelefoons: ${latestConfirmedBooking.cart.headphonesCount} stuks
Aantal zenders: ${latestConfirmedBooking.cart.transmittersCount} kanalen
Betaalmethode: ${latestConfirmedBooking.paymentMethod.toUpperCase()}
Totaalbedrag: €${latestConfirmedBooking.pricingSummary.totalIncVat.toFixed(2)} (incl. €${latestConfirmedBooking.pricingSummary.depositAmount.toFixed(2)} borg)
    `.trim();

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Boekingsdetails gekopieerd!');
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
          /* STEP 4: CONFIRMATION */
          <div className="p-6 sm:p-10 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Reservering Bevestigd
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Bedankt voor je reservering, {latestConfirmedBooking.customerName.split(' ')[0]}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1">
                  Je silent disco set staat klaar om opgehaald te worden op onze locatie in <strong>Uithoorn</strong>. We hebben de bevestiging gestuurd naar <strong className="text-cyan-300">{latestConfirmedBooking.email}</strong>.
                </p>
              </div>
            </div>

            {/* Slip */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6 text-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shrink-0 shadow-md">
                    <img src={brandLogo} alt="Silence Disco Verhuur Uithoorn" className="w-full h-full object-cover rounded-full bg-black" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Silence Disco Verhuur Uithoorn</div>
                    <div className="text-base font-extrabold font-mono text-cyan-400">
                      #{latestConfirmedBooking.id}
                    </div>
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
                    <span>Gereserveerd</span>
                  </span>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-slate-500 block mb-1">Huurperiode</span>
                  <p className="font-semibold text-white">
                    {formatDutchDate(latestConfirmedBooking.startDate, false)} t/m{' '}
                    {formatDutchDate(latestConfirmedBooking.returnDate, false)}
                  </p>
                  <p className="text-cyan-300 text-[11px]">
                    Feestdatum: {formatDutchDate(latestConfirmedBooking.eventDate)}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Afhaallocatie Uithoorn</span>
                  <p className="font-semibold text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    {settings.pickupLocationAddress}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Gewenst tijdstip: {latestConfirmedBooking.pickupTimeSlot || 'In overleg'}
                  </p>
                </div>
              </div>

              {/* Price details */}
              <div className="space-y-2 pt-1 text-slate-300">
                <div className="flex justify-between">
                  <span>{latestConfirmedBooking.cart.headphonesCount} × Silent Disco LED-Koptelefoons</span>
                  <span className="font-mono tabular-nums text-white">
                    €{latestConfirmedBooking.pricingSummary.headphonesSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{latestConfirmedBooking.cart.transmittersCount} × Zender (incl. alle kabels)</span>
                  <span className="font-mono tabular-nums text-white">
                    €{latestConfirmedBooking.pricingSummary.transmittersSubtotal.toFixed(2)}
                  </span>
                </div>

                {latestConfirmedBooking.pricingSummary.customProductsBreakdown.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.count} × {item.name}</span>
                    <span className="font-mono tabular-nums text-white">€{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-emerald-400">
                  <span>Zelf Ophalen in Uithoorn</span>
                  <span className="font-mono tabular-nums font-bold">Gratis</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Borg (retour bij inlevering)</span>
                  <span className="font-mono tabular-nums">
                    €{latestConfirmedBooking.pricingSummary.depositAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                  <span>Totaalbedrag (incl. 21% BTW)</span>
                  <span className="text-lg font-mono font-extrabold text-cyan-400 tabular-nums">
                    €{latestConfirmedBooking.pricingSummary.totalIncVat.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyReservation}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Gekopieerd!' : 'Kopieer Boekingsbewijs'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Bewaar Factuur</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLatestConfirmedBooking(null);
                  closeBookingModal();
                  setStep(1);
                }}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl cursor-pointer"
              >
                Sluiten
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1, 2, 3 */
          <div>
            {/* Header step tracker */}
            <div className="p-6 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>1</div>
                  <span className={`text-xs font-semibold ${step === 1 ? 'text-white' : 'text-slate-400'}`}>Datum & Voorraad</span>
                </div>
                <div className="w-8 h-[1px] bg-slate-800" />
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>2</div>
                  <span className={`text-xs font-semibold ${step === 2 ? 'text-white' : 'text-slate-400'}`}>Contact & Ophalen</span>
                </div>
                <div className="w-8 h-[1px] bg-slate-800" />
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>3</div>
                  <span className={`text-xs font-semibold ${step === 3 ? 'text-white' : 'text-slate-400'}`}>Bevestiging</span>
                </div>
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleProceedToDetails} className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Stap 1: Feestdatum & Afhaalperiode in Uithoorn
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Controleer direct de live voorraad in Uithoorn ({settings.totalStockHeadphones} koptelefoons).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ophaaldag Uithoorn</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

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
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Retourdag Uithoorn</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.returnDate}
                      onChange={(e) => handleDateChange('returnDate', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${availabilityCheck.isAvailable ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/40 border-rose-500/50 text-rose-200'}`}>
                  {availabilityCheck.isAvailable ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <RotateCcw className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-sm text-white">
                      {availabilityCheck.isAvailable ? 'Direct Beschikbaar in Uithoorn' : 'Onvoldoende voorraad'}
                    </div>
                    <p className="text-slate-300">
                      Nog <strong className="text-white font-mono">{availabilityCheck.minAvailable}</strong> koptelefoons vrij. Jouw set van <strong className="text-cyan-300 font-mono">{cart.headphonesCount}</strong> stuks staat gereserveerd.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Jouw selectie:</span>
                    <span className="font-bold text-white">{cart.headphonesCount} koptelefoons · {cart.transmittersCount} zenders</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Totaal (incl. borg):</span>
                    <span className="text-base font-extrabold font-mono text-cyan-400">€{pricing.totalIncVat.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={!availabilityCheck.isAvailable}
                    className="px-8 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 disabled:opacity-40 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Volgende: Contact & Ophaalmoment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Stap 2: Contactgegevens & Afspraak Uithoorn
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Vul je gegevens in zodat we de koffer gereedmaken op onze vaste locatie in Uithoorn.
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
                      placeholder="bijv. Mark van Dijk"
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
                      placeholder="mark@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Mobiel Telefoonnummer *</span>
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-pink-400" />
                      <span>Woonplaats / Omstreken</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Uithoorn, De Kwakel, Aalsmeer, Amstelveen..."
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Afhaallocatie: {settings.pickupLocationAddress}</span>
                  </div>
                  <label className="block text-xs font-semibold text-slate-300 pt-1">
                    Gewenst Ophaalmoment (ongeveer):
                  </label>
                  <input
                    type="text"
                    value={formData.pickupTimeSlot}
                    onChange={(e) => setFormData({ ...formData, pickupTimeSlot: e.target.value })}
                    placeholder="bijv. Vrijdag tussen 16:00 en 18:00 uur"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                  <p className="text-[11px] text-slate-400">
                    Geen verzending per post; je haalt de stevige koffer zelf op in Uithoorn.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Opmerkingen (optioneel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Speciale verzoeken of vragen..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Terug</span>
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Volgende: Betaalwijze & Bevestigen</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <form onSubmit={handleExecutePayment} className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Stap 3: Kies Betaalwijze & Afronden
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Kies hoe je wilt betalen: vooraf via iDEAL/kaart, op factuur, of contant/pinnen bij afhalen in Uithoorn.
                  </p>
                </div>

                {/* Methods */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'ideal', label: 'iDEAL', icon: '🏦' },
                    { id: 'cash_at_pickup', label: 'Bij Afhalen', icon: '🤝' },
                    { id: 'creditcard', label: 'Creditcard', icon: '💳' },
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

                {/* Payment specific */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                  {selectedMethod === 'ideal' && (
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-300">
                        Selecteer je bank:
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
                    </div>
                  )}

                  {selectedMethod === 'cash_at_pickup' && (
                    <div className="text-xs text-slate-300 space-y-2">
                      <div className="font-bold text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>Betalen bij Afhalen in Uithoorn</span>
                      </div>
                      <p className="text-slate-400">
                        Je betaalt het totaalbedrag (inclusief borg) eenvoudig contant of via mobiel betaalverzoek / pin wanneer je de set ophaalt op de Wiegerbruinlaan in Uithoorn.
                      </p>
                    </div>
                  )}

                  {selectedMethod === 'creditcard' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">Naam Kaarthouder</label>
                        <input
                          type="text"
                          required
                          placeholder="Mark van Dijk"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">Kaartnummer</label>
                        <input
                          type="text"
                          required
                          placeholder="4532 ···· ···· 8921"
                          maxLength={19}
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'invoice' && (
                    <div className="text-xs text-slate-300 space-y-2">
                      <p>
                        <strong>Op Factuur (14 dagen betaaltermijn):</strong> Factuur wordt digitaal verzonden naar {formData.email}.
                      </p>
                    </div>
                  )}
                </div>

                {/* Price review */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Huurbedrag ({cart.headphonesCount} koptelefoons)</span>
                    <span className="font-mono tabular-nums text-white">€{pricing.rentalSubtotal.toFixed(2)}</span>
                  </div>

                  {pricing.customProductsBreakdown.map((item) => (
                    <div key={item.id} className="flex justify-between text-slate-400">
                      <span>{item.count} × {item.name}</span>
                      <span className="font-mono tabular-nums text-white">€{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="flex justify-between text-emerald-400">
                    <span>Zelf Ophalen in Uithoorn</span>
                    <span className="font-mono tabular-nums font-bold">Gratis</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Borg (retour bij inlevering)</span>
                    <span className="font-mono tabular-nums text-white">€{pricing.depositAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-white">Totaal (incl. 21% BTW):</span>
                    <span className="text-xl font-extrabold font-mono text-emerald-400 tabular-nums">
                      €{pricing.totalIncVat.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Processing Overlay */}
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
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Terug</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="px-8 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Reservering Bevestigen</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
