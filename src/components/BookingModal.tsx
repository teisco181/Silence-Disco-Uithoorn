import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { ReservationDetails } from '../types/rental';
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
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    cart,
    pricing,
    confirmedReservation,
    setConfirmedReservation,
    showToast,
  } = useRental();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    address: '',
    postalCode: '',
    city: '',
    notes: '',
  });

  const [copied, setCopied] = useState(false);

  if (!isBookingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast('Vul alstublieft minimaal je naam, e-mail en telefoonnummer in');
      return;
    }

    const reservation: ReservationDetails = {
      id: `SD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      eventDate: formData.eventDate,
      rentalDays: cart.rentalDays,
      deliveryType: cart.deliveryType,
      address: formData.address,
      postalCode: formData.postalCode,
      city: formData.city,
      notes: formData.notes,
      cart: { ...cart },
      pricingSummary: { ...pricing },
    };

    setConfirmedReservation(reservation);
    showToast('Reservering succesvol geplaatst!');
  };

  const handleCopyReservation = () => {
    if (!confirmedReservation) return;
    const text = `
SilentGroove Reserveringsbevestiging: ${confirmedReservation.id}
Klant: ${confirmedReservation.customerName}
Datum feest: ${confirmedReservation.eventDate}
Koptelefoons: ${confirmedReservation.cart.headphonesCount} stuks
Zenders: ${confirmedReservation.cart.transmittersCount} zenders
Totaalbedrag: €${confirmedReservation.pricingSummary.totalIncVat.toFixed(2)} (incl. €${confirmedReservation.pricingSummary.depositAmount.toFixed(2)} borg)
Status: In optie geplaatst
    `.trim();

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Reserveringsgegevens gekopieerd naar klembord!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Close button */}
        <button
          onClick={closeBookingModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Sluit venster"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedReservation ? (
          /* Success / Confirmation View */
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                Reservering #{confirmedReservation.id}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                Gefeliciteerd, je Silent Disco set staat gereserveerd!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
                We hebben een bevestiging gestuurd naar <strong className="text-slate-200">{confirmedReservation.email}</strong>. Wij zorgen dat de set op tijd klaarligt of bezorgd wordt!
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Evenement Datum</span>
                <span className="font-semibold text-white">{confirmedReservation.eventDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Uitrusting</span>
                <span className="font-semibold text-white">
                  {confirmedReservation.cart.headphonesCount} koptelefoons · {confirmedReservation.cart.transmittersCount} zenders
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Bezorgwijze</span>
                <span className="font-semibold text-white">
                  {confirmedReservation.deliveryType === 'delivery' ? 'PostNL Bezorging' : 'Zelf Ophalen'}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-300 font-bold">Totaal (incl. BTW & Borg)</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono tabular-nums">
                  €{confirmedReservation.pricingSummary.totalIncVat.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyReservation}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Gekopieerd!' : 'Kopieer Gegevens'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bevestiging</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmedReservation(null);
                  closeBookingModal();
                }}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer"
              >
                Klaar & Sluiten
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                <ShoppingBag className="w-4 h-4" />
                <span>Vrijblijvende Reserveringsaanvraag</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-display">
                Jouw Silent Disco Set Reserveren
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {cart.headphonesCount} koptelefoons · {cart.transmittersCount} zenders · Totaal €{pricing.totalIncVat.toFixed(2)} incl. BTW & borg
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Event date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Datum van je feest *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Volledige Naam *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="bijv. Lisa Jansen"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>E-mailadres *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="lisa@voorbeeld.nl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Telefoonnummer *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Address if delivery */}
              {cart.deliveryType === 'delivery' && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Afleveradres voor PostNL koffer:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Straatnaam & Huisnummer"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Postcode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Woonplaats (bijv. Amsterdam)"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Opmerkingen of specifieke wensen (optioneel)
                </label>
                <textarea
                  rows={2}
                  placeholder="bijv. Extra verloopstekker voor DJ mengtafel, tijdig bezorgen op vrijdagmiddag..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Price reminder */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Totaalbedrag reservering:</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono">
                  €{pricing.totalIncVat.toFixed(2)}{' '}
                  <span className="text-[10px] text-slate-400 font-normal">(incl. borg)</span>
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Bevestig Reservering</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Geen directe betaling vereist · Je ontvangt eerst een factuur</span>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
