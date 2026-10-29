import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { RentalSettings, DealOffer, TierPricing, BookingRecord, OrderStatus, PaymentStatus } from '../types/rental';
import { formatDutchDate } from '../utils/availability';
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
  Edit2,
  X,
  MapPin,
  Building,
  ShieldAlert,
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
  const [adminSubTab, setAdminSubTab] = useState<'tarieven' | 'pakketten' | 'boekingen'>('tarieven');

  // Local state for editable settings
  const [formSettings, setFormSettings] = useState<RentalSettings>({
    ...settings,
    tierPricing: settings.tierPricing.map((t) => ({ ...t })),
  });

  // State for editing an existing offer or creating a new one
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerFormData, setOfferFormData] = useState<DealOffer | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');

  // State for manual booking
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

  // Offer editing functions
  const handleOpenEditOffer = (offer: DealOffer) => {
    setEditingOfferId(offer.id);
    setOfferFormData({ ...offer, features: [...offer.features] });
    setNewFeatureText('');
  };

  const handleOpenCreateOffer = () => {
    const newId = `offer-${Date.now()}`;
    const newObj: DealOffer = {
      id: newId,
      title: 'Nieuw Voordeelpakket',
      badge: 'Nieuwe Deal',
      tagline: 'Complete silent disco set met voordeel',
      headphonesCount: 30,
      transmittersCount: 2,
      discoLightsCount: 1,
      powerbanksCount: 0,
      includeDJCables: true,
      rentalDurationDays: 1,
      isWeekendDeal: false,
      fixedPrice: 89,
      originalPrice: 125,
      description: 'Luxe samengestelde set inclusief benodigde kabels en snelle service.',
      features: [
        '30 Silent disco RGB koptelefoons',
        '2 Krachtige zenders',
        '1 RGB Party discolamp',
        'Gratis retour via PostNL',
      ],
      active: true,
      popular: false,
    };
    setEditingOfferId(newId);
    setOfferFormData(newObj);
    setNewFeatureText('');
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerFormData) return;

    const exists = offers.some((o) => o.id === offerFormData.id);
    if (exists) {
      updateOffer(offerFormData.id, offerFormData);
    } else {
      addOffer(offerFormData);
    }
    setEditingOfferId(null);
    setOfferFormData(null);
  };

  const handleAddFeatureToOffer = () => {
    if (!newFeatureText.trim() || !offerFormData) return;
    setOfferFormData({
      ...offerFormData,
      features: [...offerFormData.features, newFeatureText.trim()],
    });
    setNewFeatureText('');
  };

  const handleRemoveFeatureFromOffer = (index: number) => {
    if (!offerFormData) return;
    setOfferFormData({
      ...offerFormData,
      features: offerFormData.features.filter((_, i) => i !== index),
    });
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
              <span>Volledig Beheer & Configuratie</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Silence Disco Beheerpaneel
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Beheer alle prijzen, volumestaffels, pakketten, minimale & maximale huurdagen en reserveringen.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Bekijk Website</span>
            </button>
            <button
              onClick={resetSettings}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/60 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Herstel Fabrieksinstellingen</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
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
            <span>Prijzen, Dagen & Limieten</span>
          </button>

          <button
            onClick={() => setAdminSubTab('pakketten')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminSubTab === 'pakketten'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Pakketten & Aanbiedingen ({offers.length})</span>
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
        </div>

        {/* ============================================================
            SUB-TAB 1: PRIJZEN, DAGEN & LIMIETEN
           ============================================================ */}
        {adminSubTab === 'tarieven' && (
          <form onSubmit={handleSaveSettings} className="space-y-10">
            
            {/* Card 1: Dagen & Huurbeperkingen */}
            <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-800">
                <Clock className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 className="text-xl font-bold text-white font-display">
                    Huurduur, Maximale Dagen & Toeslagfactoren
                  </h2>
                  <p className="text-xs text-slate-400">
                    Stel hier in hoeveel dagen klanten maximaal kunnen huren en hoe meerdagentarieven berekend worden.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Max Days */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Maximaal Aantal Huurdagen
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={formSettings.maxDays}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          maxDays: parseInt(e.target.value) || 14,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">dagen</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Bovengrens voor de huurcalculator
                  </span>
                </div>

                {/* Min Days */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Minimaal Aantal Huurdagen
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={formSettings.minDays}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          minDays: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">dagen</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Standaard 1 feestdag
                  </span>
                </div>

                {/* Weekend Surcharge Multiplier */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Weekend Factor (1.0 = 3 Dagen voor 1 Dag)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.05"
                      min="0.5"
                      max="3.0"
                      value={formSettings.weekendSurchargeMultiplier}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          weekendSurchargeMultiplier: parseFloat(e.target.value) || 1.0,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">× tarief</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    1.0 = geen meerkosten voor weekend
                  </span>
                </div>

                {/* Extra day factor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Toeslag per Extra Huurdag Factor
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="1.0"
                      value={formSettings.multidayExtraDayFactor}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          multidayExtraDayFactor: parseFloat(e.target.value) || 0.5,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">× dag</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    0.50 = +50% per extra dag na dag 1
                  </span>
                </div>

              </div>
            </div>

            {/* Card 2: Koptelefoons Voorraad & Prijzen */}
            <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-800">
                <Headphones className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white font-display">
                  Voorraad & Alle Basisprijzen
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Stock */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Totale Magazijnvoorraad
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
                </div>

                {/* Max Headphones per order */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Max. Koptelefoons per Bestelling
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="5000"
                      value={formSettings.maxHeadphonesPerOrder}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          maxHeadphonesPerOrder: parseInt(e.target.value) || 350,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">stuks</span>
                  </div>
                </div>

                {/* Min Headphones */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Min. Koptelefoons per Bestelling
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
                          minHeadphones: parseInt(e.target.value) || 5,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">stuks</span>
                  </div>
                </div>

                {/* Base price per headphone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Basisprijs per Koptelefoon (€/dag)
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
                </div>

                {/* Transmitter Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Prijs per Zender (€)
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

                {/* Powerbank price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Prijs per Outdoor Powerbank (€)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">€</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={formSettings.pricePowerbank}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          pricePowerbank: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Shipping cost */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    PostNL Heen & Retour (€)
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

                {/* BTW percentage */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    BTW Tarief (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formSettings.vatPercentage}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          vatPercentage: parseInt(e.target.value) || 21,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">%</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Card 3: Volumekorting Staffels */}
            <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Tag className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white font-display">
                      Volumekorting Staffels (Per Koptelefoon)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Stel staffels in waarbij de stuksprijs daalt naarmate de klant meer koptelefoons huurt.
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

            {/* Card 4: Bedrijfs- & Afhaallocatie Info */}
            <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-800">
                <Building className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white font-display">
                  Bedrijfsgegevens & Afhaallocatie
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Bedrijfsnaam / Merk
                  </label>
                  <input
                    type="text"
                    value={formSettings.companyName}
                    onChange={(e) => setFormSettings({ ...formSettings, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    E-mailadres Klantenservice
                  </label>
                  <input
                    type="email"
                    value={formSettings.companyEmail}
                    onChange={(e) => setFormSettings({ ...formSettings, companyEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Telefoonnummer
                  </label>
                  <input
                    type="text"
                    value={formSettings.companyPhone}
                    onChange={(e) => setFormSettings({ ...formSettings, companyPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Afhaallocatie Adres (Uithoorn)
                  </label>
                  <input
                    type="text"
                    value={formSettings.pickupLocationAddress}
                    onChange={(e) => setFormSettings({ ...formSettings, pickupLocationAddress: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Save Button for Settings */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Alle Prijzen & Instellingen Opslaan</span>
              </button>
            </div>

          </form>
        )}

        {/* ============================================================
            SUB-TAB 2: PAKKETTEN & AANBIEDINGEN (VOLLEDIGE EDITOR)
           ============================================================ */}
        {adminSubTab === 'pakketten' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  Pakketten & Aanbiedingen Beheren
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Pas prijzen, koptelefoon-aantallen, huurdagen, teksten en inbegrepen opties van elk pakket aan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenCreateOffer}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nieuw Pakket Aanmaken</span>
                </button>
                <button
                  type="button"
                  onClick={resetOffers}
                  className="px-3.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Reset Pakketten
                </button>
              </div>
            </div>

            {/* Modal / Inline Editor for creating or editing an offer */}
            {offerFormData && (
              <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border-2 border-amber-500/60 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-lg font-bold text-white font-display">
                      Pakket Bewerken: {offerFormData.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setOfferFormData(null);
                      setEditingOfferId(null);
                    }}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveOffer} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    
                    {/* Title */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Titel van het Pakket *</label>
                      <input
                        type="text"
                        required
                        value={offerFormData.title}
                        onChange={(e) => setOfferFormData({ ...offerFormData, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    {/* Badge */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Badge Label</label>
                      <input
                        type="text"
                        value={offerFormData.badge}
                        onChange={(e) => setOfferFormData({ ...offerFormData, badge: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    {/* Tagline */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Korte Slagzin (Tagline)</label>
                      <input
                        type="text"
                        value={offerFormData.tagline}
                        onChange={(e) => setOfferFormData({ ...offerFormData, tagline: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    {/* Headphones count */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Aantal Koptelefoons</label>
                      <input
                        type="number"
                        min="1"
                        value={offerFormData.headphonesCount}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            headphonesCount: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    {/* Transmitters count */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Aantal Zenders / Kanalen</label>
                      <input
                        type="number"
                        min="1"
                        max="3"
                        value={offerFormData.transmittersCount}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            transmittersCount: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    {/* Disco Lights */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Aantal Discolampen</label>
                      <input
                        type="number"
                        min="0"
                        value={offerFormData.discoLightsCount}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            discoLightsCount: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    {/* Fixed actieprijs */}
                    <div>
                      <label className="block text-amber-300 font-semibold mb-1">Vaste Actieprijs (€) *</label>
                      <input
                        type="number"
                        step="0.50"
                        value={offerFormData.fixedPrice}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            fixedPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-950 border border-amber-500 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm"
                      />
                    </div>

                    {/* Oorspronkelijke prijs */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Oorspronkelijke Prijs (€)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={offerFormData.originalPrice}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            originalPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    {/* Rental duration days */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Huurduur (Aantal Dagen)</label>
                      <input
                        type="number"
                        min="1"
                        value={offerFormData.rentalDurationDays}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            rentalDurationDays: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                  </div>

                  {/* Toggles: Weekend deal & Popular */}
                  <div className="flex flex-wrap gap-4 text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <input
                        type="checkbox"
                        checked={offerFormData.isWeekendDeal}
                        onChange={(e) => setOfferFormData({ ...offerFormData, isWeekendDeal: e.target.checked })}
                        className="w-4 h-4 rounded text-cyan-400"
                      />
                      <span className="text-white font-medium">Geldt als Weekenddeal (Vrijdag t/m Maandag)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <input
                        type="checkbox"
                        checked={offerFormData.popular}
                        onChange={(e) => setOfferFormData({ ...offerFormData, popular: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-400"
                      />
                      <span className="text-white font-medium">Markeer als "Meest Populair"</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <input
                        type="checkbox"
                        checked={offerFormData.active}
                        onChange={(e) => setOfferFormData({ ...offerFormData, active: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-400"
                      />
                      <span className="text-white font-medium">Pakket Zichtbaar (Actief)</span>
                    </label>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Pakket Omschrijving
                    </label>
                    <textarea
                      rows={2}
                      value={offerFormData.description}
                      onChange={(e) => setOfferFormData({ ...offerFormData, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  {/* Features / Bullets builder */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Inbegrepen Pluspunten (Bullets)
                    </label>
                    <div className="space-y-1.5">
                      {offerFormData.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                          <span className="text-slate-200">✓ {feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeatureFromOffer(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Nieuw pluspunt toevoegen (bijv. Inclusief reservekoptelefoon)..."
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeatureToOffer}
                        className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
                      >
                        Toevoegen
                      </button>
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setOfferFormData(null);
                        setEditingOfferId(null);
                      }}
                      className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Pakket Opslaan
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* List of current packages with direct edit buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    offer.active
                      ? 'bg-slate-900 border-slate-800 shadow-xl'
                      : 'bg-slate-900/40 border-slate-800/40 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        {offer.badge} {offer.popular ? '· Populair' : ''}
                      </span>
                      <h3 className="text-lg font-bold text-white font-display">
                        {offer.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditOffer(offer)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
                        title="Pakket bewerken"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteOffer(offer.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Pakket verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {offer.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Koptelefoons</span>
                      <span className="font-mono font-bold text-white">{offer.headphonesCount} stuks</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Zenders</span>
                      <span className="font-mono font-bold text-white">{offer.transmittersCount} kanalen</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Huurduur</span>
                      <span className="font-mono font-bold text-white">{offer.rentalDurationDays} dag(en)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                        €{offer.fixedPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-500 line-through font-mono">
                        €{offer.originalPrice.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateOffer(offer.id, { active: !offer.active })}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        offer.active
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {offer.active ? 'Actief' : 'Gedeactiveerd'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ============================================================
            SUB-TAB 3: BOEKINGEN & BESCHIKBAARHEID
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

      </div>
    </div>
  );
};
