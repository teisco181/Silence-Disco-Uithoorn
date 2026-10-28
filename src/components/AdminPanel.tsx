import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { RentalSettings, DealOffer, TierPricing, BookingRecord, OrderStatus, PaymentStatus } from '../types/rental';
import { formatDutchDate, getAvailabilityForDate } from '../utils/availability';
import {
  Settings,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Tag,
  Headphones,
  Radio,
  Sparkles,
  DollarSign,
  AlertCircle,
  Eye,
  Sliders,
  Calendar,
  Package,
  Truck,
  User,
  Phone,
  Mail,
  Clock,
  Filter,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetSettings,
    offers,
    updateOffer,
    addOffer,
    deleteOffer,
    resetOffers,
    bookings,
    updateBookingStatus,
    deleteBooking,
    addBooking,
    setActiveTab,
    showToast,
  } = useRental();

  // Admin subtabs
  const [adminSubTab, setAdminSubTab] = useState<'tarieven' | 'boekingen' | 'aanbiedingen'>('tarieven');

  // Local state for editable settings
  const [formSettings, setFormSettings] = useState<RentalSettings>({
    ...settings,
    tierPricing: settings.tierPricing.map((t) => ({ ...t })),
  });

  // State for creating a new offer modal/inline form
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<DealOffer>>({
    title: '',
    badge: 'Tijdelijke Deal',
    tagline: '',
    headphonesCount: 30,
    transmittersCount: 2,
    discoLightsCount: 1,
    powerbanksCount: 0,
    includeDJCables: true,
    rentalDurationDays: 1,
    isWeekendDeal: false,
    fixedPrice: 89,
    originalPrice: 120,
    description: '',
    features: ['Inclusief aansluitkabels', 'Gratis PostNL retourlabel'],
    active: true,
  });

  // State for adding a manual booking
  const [isAddingManualBooking, setIsAddingManualBooking] = useState(false);
  const [manualBookingData, setManualBookingData] = useState({
    customerName: '',
    email: '',
    phone: '',
    startDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    eventDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    headphonesCount: 25,
    transmittersCount: 2,
    deliveryType: 'delivery' as 'delivery' | 'pickup',
    paymentStatus: 'paid' as PaymentStatus,
    paymentMethod: 'invoice' as const,
    notes: 'Handmatig ingevoerd via beheer',
  });

  // Booking search/filter
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'prepared' | 'shipped' | 'returned'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.orderStatus === bookingFilter;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
  };

  const handleTierChange = (index: number, field: keyof TierPricing, value: any) => {
    const updatedTiers = [...formSettings.tierPricing];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setFormSettings({ ...formSettings, tierPricing: updatedTiers });
  };

  const handleAddTier = () => {
    const newTier: TierPricing = {
      minCount: 150,
      maxCount: null,
      pricePerHeadphone: 1.80,
      label: '150+ stuks',
    };
    setFormSettings({
      ...formSettings,
      tierPricing: [...formSettings.tierPricing, newTier],
    });
  };

  const handleRemoveTier = (index: number) => {
    const updatedTiers = formSettings.tierPricing.filter((_, i) => i !== index);
    setFormSettings({ ...formSettings, tierPricing: updatedTiers });
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.title || !newOffer.fixedPrice) return;

    const offerToSave: DealOffer = {
      id: `offer-${Date.now()}`,
      title: newOffer.title || 'Nieuw Pakket',
      badge: newOffer.badge || 'Actie',
      tagline: newOffer.tagline || 'Voordelige samengestelde set',
      headphonesCount: Number(newOffer.headphonesCount) || 20,
      transmittersCount: Number(newOffer.transmittersCount) || 2,
      discoLightsCount: Number(newOffer.discoLightsCount) || 0,
      powerbanksCount: Number(newOffer.powerbanksCount) || 0,
      includeDJCables: true,
      rentalDurationDays: Number(newOffer.rentalDurationDays) || 1,
      isWeekendDeal: !!newOffer.isWeekendDeal,
      fixedPrice: Number(newOffer.fixedPrice) || 75,
      originalPrice: Number(newOffer.originalPrice) || 100,
      description: newOffer.description || 'Complete silent disco set met korting.',
      features: (newOffer.features && newOffer.features.length > 0)
        ? newOffer.features
        : ['Gratis kabels', 'Plug & Play'],
      active: true,
    };

    addOffer(offerToSave);
    setIsAddingOffer(false);
  };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBookingData.customerName || !manualBookingData.email) return;

    const baseCost = manualBookingData.headphonesCount * settings.basePricePerHeadphone;
    const txCost = manualBookingData.transmittersCount * settings.pricePerTransmitter;
    const total = baseCost + txCost + settings.defaultDeposit;

    const booking: BookingRecord = {
      id: `SD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: manualBookingData.customerName,
      email: manualBookingData.email,
      phone: manualBookingData.phone || '06 00000000',
      startDate: manualBookingData.startDate,
      eventDate: manualBookingData.eventDate,
      returnDate: manualBookingData.returnDate,
      rentalDays: 3,
      deliveryType: manualBookingData.deliveryType,
      notes: manualBookingData.notes,
      cart: {
        headphonesCount: manualBookingData.headphonesCount,
        transmittersCount: manualBookingData.transmittersCount,
        startDate: manualBookingData.startDate,
        eventDate: manualBookingData.eventDate,
        returnDate: manualBookingData.returnDate,
        rentalDays: 3,
        isWeekend: true,
        discoLightsCount: 0,
        powerbanksCount: 0,
        includeDJCables: true,
        deliveryType: manualBookingData.deliveryType,
        appliedOfferId: null,
        promoCode: '',
      },
      pricingSummary: {
        headphonesCount: manualBookingData.headphonesCount,
        headphonesUnitPrice: settings.basePricePerHeadphone,
        headphonesSubtotal: baseCost,
        transmittersCount: manualBookingData.transmittersCount,
        transmittersSubtotal: txCost,
        discoLightsSubtotal: 0,
        powerbanksSubtotal: 0,
        cablesSubtotal: 0,
        durationMultiplier: 1.0,
        rentalSubtotal: baseCost + txCost,
        discountAmount: 0,
        shippingCost: manualBookingData.deliveryType === 'delivery' ? settings.shippingCostRoundtrip : 0,
        depositAmount: settings.defaultDeposit,
        subtotalExVat: baseCost + txCost,
        vatAmount: (baseCost + txCost) * 0.21,
        totalIncVat: total,
        pricePerPerson: total / manualBookingData.headphonesCount,
      },
      paymentMethod: manualBookingData.paymentMethod,
      paymentStatus: manualBookingData.paymentStatus,
      transactionId: `MANUAL-${Date.now()}`,
      orderStatus: 'confirmed',
    };

    addBooking(booking);
    setIsAddingManualBooking(false);
    showToast('Handmatige boeking succesvol geregistreerd!');
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-950 text-slate-100 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
              <Settings className="w-4 h-4" />
              <span>Eigenaars & Beheerders Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              SilentGroove Beheerpaneel
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Beheer prijzen, voorraad staffels, alle klantboekingen en lopende actiepakketten.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Bekijk Klantweergave</span>
            </button>
            <button
              onClick={resetSettings}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/60 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Herstel Standaard</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs inside Admin */}
        <div className="flex items-center gap-2 pb-6 border-b border-slate-800/80 mb-8 overflow-x-auto">
          <button
            onClick={() => setAdminSubTab('tarieven')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminSubTab === 'tarieven'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Prijzen & Voorraad</span>
          </button>

          <button
            onClick={() => setAdminSubTab('boekingen')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminSubTab === 'boekingen'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Boekingen & Beschikbaarheid ({bookings.length})</span>
          </button>

          <button
            onClick={() => setAdminSubTab('aanbiedingen')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminSubTab === 'aanbiedingen'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Aanbiedingen Beheer ({offers.length})</span>
          </button>
        </div>

        {/* ============================================================
            SUB-TAB 1: PRIJZEN & VOORRAAD
           ============================================================ */}
        {adminSubTab === 'tarieven' && (
          <form onSubmit={handleSaveSettings} className="space-y-10">
            
            {/* Voorraad & Basistarieven */}
            <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-800">
                <Headphones className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white font-display">
                  Koptelefoons Voorraad & Basis Verhuurprijzen
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Total Stock */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Totale Voorraad Koptelefoons (stuks)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="5000"
                      value={formSettings.totalStockHeadphones}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          totalStockHeadphones: parseInt(e.target.value) || 10,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">stuks</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Capaciteit voor realtime beschikbaarheid
                  </span>
                </div>

                {/* Minimum Headphones */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Minimale Huurhoeveelheid
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formSettings.minHeadphones}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          minHeadphones: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">stuks</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Ondergrens voor bestellingen
                  </span>
                </div>

                {/* Base Price per Headphone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Basisprijs per Koptelefoon (€ per dag)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">€</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={formSettings.basePricePerHeadphone}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          basePricePerHeadphone: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Standaard tarief per stuk
                  </span>
                </div>

                {/* Price per Transmitter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Prijs per Zender (€ per stuk)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">€</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={formSettings.pricePerTransmitter}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          pricePerTransmitter: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Disco light price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Prijs per Discolamp (€)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">€</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={formSettings.pricePerDiscoLight}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          pricePerDiscoLight: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Shipping Fee */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    PostNL Heen & Terug Verzendkosten (€)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">€</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={formSettings.shippingCostRoundtrip}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          shippingCostRoundtrip: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Deposit */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Standaard Borgbedrag (€)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">€</span>
                    <input
                      type="number"
                      step="5.00"
                      min="0"
                      value={formSettings.defaultDeposit}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          defaultDeposit: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Volume Staffelkortingen */}
            <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Tag className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white font-display">
                      Volumekorting Staffels (Per Koptelefoon)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Stel in welke stuksprijs geldt bij grotere bestellingen.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddTier}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded-lg hover:bg-cyan-900/60 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nieuwe Staffel Toevoegen</span>
                </button>
              </div>

              <div className="space-y-3">
                {formSettings.tierPricing.map((tier, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3.5 bg-slate-950 rounded-xl border border-slate-800"
                  >
                    <div className="sm:col-span-4">
                      <label className="text-[11px] text-slate-500 block mb-1">Label / Omschrijving</label>
                      <input
                        type="text"
                        value={tier.label}
                        onChange={(e) => handleTierChange(index, 'label', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-slate-500 block mb-1">Vanaf (stuks)</label>
                      <input
                        type="number"
                        min="1"
                        value={tier.minCount}
                        onChange={(e) =>
                          handleTierChange(index, 'minCount', parseInt(e.target.value) || 1)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-slate-500 block mb-1">Tot (leeg = onbeperkt)</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="∞"
                        value={tier.maxCount === null ? '' : tier.maxCount}
                        onChange={(e) =>
                          handleTierChange(
                            index,
                            'maxCount',
                            e.target.value === '' ? null : parseInt(e.target.value) || null
                          )
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] text-slate-500 block mb-1">Prijs per koptelefoon (€)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">€</span>
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          value={tier.pricePerHeadphone}
                          onChange={(e) =>
                            handleTierChange(
                              index,
                              'pricePerHeadphone',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(index)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Verwijder staffel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button for Settings */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Prijzen & Voorraad Opslaan</span>
              </button>
            </div>

          </form>
        )}

        {/* ============================================================
            SUB-TAB 2: BOEKINGEN & BESCHIKBAARHEID
           ============================================================ */}
        {adminSubTab === 'boekingen' && (
          <div className="space-y-8">
            
            {/* KPI stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Totaal Actieve Boekingen</span>
                <span className="text-2xl font-bold font-mono text-white">{bookings.length}</span>
              </div>

              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Totale Voorraad</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {settings.totalStockHeadphones} stuks
                </span>
              </div>

              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Gereserveerde Koptelefoons</span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {bookings.reduce((sum, b) => sum + b.cart.headphonesCount, 0)} stuks
                </span>
              </div>

              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Totale Omzet (incl. BTW)</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  €{bookings.reduce((sum, b) => sum + b.pricingSummary.totalIncVat, 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Filter & Action bar */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs text-slate-400 font-medium">Filter status:</span>
                {(['all', 'confirmed', 'prepared', 'shipped', 'returned'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      bookingFilter === st
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'Alle Boekingen' : st}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsAddingManualBooking(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Handmatige Boeking / Blokkeer Datum</span>
              </button>
            </div>

            {/* Manual booking modal / inline form */}
            {isAddingManualBooking && (
              <div className="p-6 bg-slate-900 rounded-2xl border border-cyan-500/50 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-cyan-300">Handmatige Boeking Toevoegen</h3>
                  <button
                    onClick={() => setIsAddingManualBooking(false)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Annuleren
                  </button>
                </div>

                <form onSubmit={handleCreateManualBooking} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Klantnaam *</label>
                    <input
                      type="text"
                      required
                      placeholder="bijv. Sportclub Victoria"
                      value={manualBookingData.customerName}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, customerName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">E-mail *</label>
                    <input
                      type="email"
                      required
                      placeholder="info@victoria.nl"
                      value={manualBookingData.email}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Aantal Koptelefoons</label>
                    <input
                      type="number"
                      value={manualBookingData.headphonesCount}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, headphonesCount: parseInt(e.target.value) || 10 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Startdatum</label>
                    <input
                      type="date"
                      value={manualBookingData.startDate}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, startDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Feestdatum</label>
                    <input
                      type="date"
                      value={manualBookingData.eventDate}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, eventDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Retourdatum</label>
                    <input
                      type="date"
                      value={manualBookingData.returnDate}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, returnDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Boeking Opslaan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Bookings List Table */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Boeking #</th>
                      <th className="py-3.5 px-4 font-semibold">Klant</th>
                      <th className="py-3.5 px-4 font-semibold">Data & Periode</th>
                      <th className="py-3.5 px-4 font-semibold">Uitrusting</th>
                      <th className="py-3.5 px-4 font-semibold">Bedrag</th>
                      <th className="py-3.5 px-4 font-semibold">Betaling</th>
                      <th className="py-3.5 px-4 font-semibold">Orderstatus</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                          #{booking.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{booking.customerName}</div>
                          <div className="text-[11px] text-slate-400">{booking.email}</div>
                          <div className="text-[11px] text-slate-500">{booking.phone}</div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-medium text-slate-200">
                            Feest: {booking.eventDate}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {booking.startDate} t/m {booking.returnDate}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-bold text-white">
                            {booking.cart.headphonesCount} koptelefoons
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {booking.cart.transmittersCount} zenders · {booking.deliveryType === 'delivery' ? 'PostNL' : 'Afhalen'}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-white tabular-nums whitespace-nowrap">
                          €{booking.pricingSummary.totalIncVat.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              booking.paymentStatus === 'paid'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {booking.paymentStatus} ({booking.paymentMethod})
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <select
                            value={booking.orderStatus}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value as OrderStatus)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                          >
                            <option value="confirmed">Bevestigd</option>
                            <option value="prepared">Klaargezet</option>
                            <option value="shipped">Verzonden via PostNL</option>
                            <option value="returned">Geretourneerd (Klaar)</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => deleteBooking(booking.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-950 transition-colors"
                            title="Verwijder boeking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================
            SUB-TAB 3: AANBIEDINGEN BEHEER
           ============================================================ */}
        {adminSubTab === 'aanbiedingen' && (
          <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-xl font-bold text-white font-display">
                    Aanbiedingen & Pakketten Beheer
                  </h2>
                  <p className="text-xs text-slate-400">
                    Beheer de voordeelpakketten die zichtbaar zijn op de Aanbiedingen pagina.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingOffer(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nieuwe Aanbieding Aanmaken</span>
                </button>
                <button
                  type="button"
                  onClick={resetOffers}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Reset Deals
                </button>
              </div>
            </div>

            {/* Form to add a new deal if active */}
            {isAddingOffer && (
              <div className="mb-8 p-6 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-amber-300">Nieuw Voordeelpakket Samenstellen</h3>
                  <button
                    onClick={() => setIsAddingOffer(false)}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Annuleren
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Titel aanbieding</label>
                    <input
                      type="text"
                      placeholder="bijv. Bruiloft Silent Disco Deal"
                      value={newOffer.title}
                      onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Badge label</label>
                    <input
                      type="text"
                      placeholder="bijv. Bestseller / Weekend"
                      value={newOffer.badge}
                      onChange={(e) => setNewOffer({ ...newOffer, badge: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Aantal koptelefoons</label>
                    <input
                      type="number"
                      value={newOffer.headphonesCount}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, headphonesCount: parseInt(e.target.value) || 10 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Actieprijs (€)</label>
                    <input
                      type="number"
                      step="1.00"
                      value={newOffer.fixedPrice}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, fixedPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Oorspronkelijke waarde (€)</label>
                    <input
                      type="number"
                      step="1.00"
                      value={newOffer.originalPrice}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, originalPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Omschrijving</label>
                    <input
                      type="text"
                      placeholder="Korte toelichting voor de klant"
                      value={newOffer.description}
                      onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCreateOffer}
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Aanbieding Opslaan
                  </button>
                </div>
              </div>
            )}

            {/* Current deals list */}
            <div className="space-y-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    offer.active
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{offer.title}</span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded">
                          {offer.badge}
                        </span>
                        {!offer.active && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-950 text-rose-300 rounded">
                            Gedeactiveerd
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span>{offer.headphonesCount} koptelefoons</span>
                        <span aria-hidden="true">·</span>
                        <span>{offer.transmittersCount} zenders</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Actieprijs:</span>
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">€</span>
                          <input
                            type="number"
                            value={offer.fixedPrice}
                            onChange={(e) =>
                              updateOffer(offer.id, {
                                fixedPrice: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2 py-1 text-xs text-white font-mono font-bold"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => updateOffer(offer.id, { active: !offer.active })}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          offer.active
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {offer.active ? 'Actief' : 'Inactief'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteOffer(offer.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        title="Verwijder aanbieding"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
