import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { RentalSettings, DealOffer, TierPricing, BookingRecord, OrderStatus, PaymentStatus, CustomProduct } from '../types/rental';
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
  Sparkles,
  DollarSign,
  AlertCircle,
  Eye,
  Sliders,
  Calendar,
  Package,
  User,
  Clock,
  Filter,
  Edit2,
  X,
  MapPin,
  Building,
  MessageSquare,
  Send,
  CheckCheck,
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
    customProducts,
    addCustomProduct,
    updateCustomProduct,
    deleteCustomProduct,
    adminConversations,
    activeConversationId,
    setActiveConversationId,
    chatMessages,
    handleSendMessage,
    setActiveTab,
    showToast,
  } = useRental();

  // Admin subtabs
  const [adminSubTab, setAdminSubTab] = useState<'tarieven' | 'producten' | 'pakketten' | 'berichten' | 'boekingen'>('producten');

  // Local state for editable settings
  const [formSettings, setFormSettings] = useState<RentalSettings>({
    ...settings,
    tierPricing: settings.tierPricing.map((t) => ({ ...t })),
  });

  // State for Custom Product creation/editing
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<CustomProduct>({
    id: '',
    name: '',
    description: '',
    price: 10,
    stock: 5,
    active: true,
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

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
    city: 'Uithoorn',
    pickupTimeSlot: 'Vrijdag 16:00 uur',
    startDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    eventDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    headphonesCount: 25,
    transmittersCount: 2,
    paymentStatus: 'paid' as PaymentStatus,
    paymentMethod: 'invoice' as const,
    notes: 'Handmatig ingevoerd voor ophalen in Uithoorn',
  });

  // Chat reply state
  const [replyInput, setReplyInput] = useState('');

  // Booking search/filter
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'prepared' | 'ready_for_pickup' | 'returned'>('all');

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

  // Product CRUD
  const handleOpenNewProduct = () => {
    setProductForm({
      id: `prod_${Date.now()}`,
      name: '',
      description: '',
      price: 12.50,
      stock: 5,
      active: true,
    });
    setEditingProductId(null);
    setIsAddingProduct(true);
  };

  const handleOpenEditProduct = (prod: CustomProduct) => {
    setProductForm({ ...prod });
    setEditingProductId(prod.id);
    setIsAddingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    if (editingProductId) {
      await updateCustomProduct(editingProductId, productForm);
    } else {
      await addCustomProduct(productForm);
    }
    setIsAddingProduct(false);
    setEditingProductId(null);
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
      title: 'Nieuw Voordeelpakket Uithoorn',
      badge: 'Nieuwe Deal',
      tagline: 'Complete set inclusief zenders en ophalen in Uithoorn',
      headphonesCount: 30,
      transmittersCount: 2,
      includeDJCables: true,
      rentalDurationDays: 1,
      isWeekendDeal: false,
      fixedPrice: 79,
      originalPrice: 110,
      description: 'Luxe samengestelde set inclusief alle benodigde kabels.',
      features: [
        '30 Silent disco RGB koptelefoons',
        '2 Zenders (Rood & Blauw kanaal)',
        'Alle kabels voor iPhone, USB-C & laptop',
        'Zelf ophalen in Uithoorn (geen verzendkosten)',
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
    const txCost = Math.max(0, manualBookingData.transmittersCount - 1) * settings.pricePerTransmitter;
    const total = baseCost + txCost + settings.defaultDeposit;

    const booking: BookingRecord = {
      id: `SD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: manualBookingData.customerName,
      email: manualBookingData.email,
      phone: manualBookingData.phone || '06 00000000',
      city: manualBookingData.city || 'Uithoorn',
      pickupTimeSlot: manualBookingData.pickupTimeSlot,
      startDate: manualBookingData.startDate,
      eventDate: manualBookingData.eventDate,
      returnDate: manualBookingData.returnDate,
      rentalDays: 3,
      deliveryType: 'pickup',
      notes: manualBookingData.notes,
      cart: {
        headphonesCount: manualBookingData.headphonesCount,
        transmittersCount: manualBookingData.transmittersCount,
        startDate: manualBookingData.startDate,
        eventDate: manualBookingData.eventDate,
        returnDate: manualBookingData.returnDate,
        rentalDays: 3,
        isWeekend: true,
        selectedProducts: {},
        includeDJCables: true,
        deliveryType: 'pickup',
        appliedOfferId: null,
        promoCode: '',
      },
      pricingSummary: {
        headphonesCount: manualBookingData.headphonesCount,
        headphonesUnitPrice: settings.basePricePerHeadphone,
        headphonesSubtotal: baseCost,
        transmittersCount: manualBookingData.transmittersCount,
        transmittersSubtotal: txCost,
        customProductsSubtotal: 0,
        customProductsBreakdown: [],
        cablesSubtotal: 0,
        durationMultiplier: 1.0,
        rentalSubtotal: baseCost + txCost,
        discountAmount: 0,
        shippingCost: 0,
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
    showToast('Handmatige boeking in Uithoorn geregistreerd!');
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeConversationId) return;
    await handleSendMessage(replyInput.trim(), activeConversationId);
    setReplyInput('');
  };

  const activeConv = adminConversations.find((c) => c.id === activeConversationId) || adminConversations[0];

  return (
    <div className="py-12 sm:py-16 bg-slate-950 text-slate-100 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
              <Settings className="w-4 h-4" />
              <span>Beheerderspaneel · Silence Disco Verhuur Uithoorn</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Beheer & Instellingen
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Beheer je eigen extra producten, voorraad, prijzen, klantberichten en lokale reserveringen in Uithoorn en omstreken.
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
              <span>Reset Tarieven</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-2 pb-6 border-b border-slate-800/80 mb-8 overflow-x-auto">
          <button
            onClick={() => setAdminSubTab('producten')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminSubTab === 'producten'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Producten & Extra's ({customProducts.length})</span>
          </button>

          <button
            onClick={() => setAdminSubTab('tarieven')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminSubTab === 'tarieven'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Prijzen, Staffels & Uithoorn Dagen</span>
          </button>

          <button
            onClick={() => setAdminSubTab('pakketten')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminSubTab === 'pakketten'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Pakketten & Aanbiedingen ({offers.length})</span>
          </button>

          <button
            onClick={() => setAdminSubTab('berichten')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminSubTab === 'berichten'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Klantenservice Chat ({adminConversations.length})</span>
          </button>

          <button
            onClick={() => setAdminSubTab('boekingen')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminSubTab === 'boekingen'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Boekingen & Reserveringen ({bookings.length})</span>
          </button>
        </div>

        {/* ============================================================
            SUB-TAB: PRODUCTEN & EXTRA'S BEHEREN (NIEUW MENU!)
           ============================================================ */}
        {adminSubTab === 'producten' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl border border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  <span>Producten Menu</span>
                  <span aria-hidden="true">·</span>
                  <span>Op Maat voor Uithoorn</span>
                </div>
                <h2 className="text-xl font-bold text-white font-display">
                  Eigen Producten & Extra's Toevoegen
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Hier beheer je alle losse artikelen die je verhuurt. Producten die je niet hebt (zoals discolampen of outdoor powerbanks) zijn verwijderd. Voeg hier zelf toe wat je wél aanbiedt met je eigen prijs en beschikbare voorraad!
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewProduct}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Nieuw Product Toevoegen</span>
              </button>
            </div>

            {/* Modal / Form to add or edit product */}
            {isAddingProduct && (
              <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border-2 border-cyan-500/70 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white font-display">
                      {editingProductId ? 'Product Bewerken' : 'Nieuw Product Toevoegen'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsAddingProduct(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">
                        Productnaam * (bijv. Draadloze Microfoon, Rookmachine, DJ Kabelset)
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="bijv. Draadloze Vaste Microfoon"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Huurprijs (€ per periode) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400">€</span>
                        <input
                          type="number"
                          step="0.50"
                          min="0"
                          required
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Beschikbare Voorraad (stuks) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={productForm.stock}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-300 font-semibold mb-1">
                        Korte Beschrijving / Toelichting voor de klant
                      </label>
                      <input
                        type="text"
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({ ...productForm, description: e.target.value })
                        }
                        placeholder="bijv. Handig voor toespraken of karaoke via de zender"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                        <input
                          type="checkbox"
                          checked={productForm.active}
                          onChange={(e) =>
                            setProductForm({ ...productForm, active: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-0"
                        />
                        <span>Zichtbaar in calculator</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Product Opslaan</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of custom products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {customProducts.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">
                    Geen extra producten geconfigureerd
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
                    De oude discolampen en outdoor powerbanks zijn verwijderd omdat je deze niet hebt. Klik op "Nieuw Product Toevoegen" om jouw eigen apparatuur toe te voegen!
                  </p>
                  <button
                    onClick={handleOpenNewProduct}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl cursor-pointer"
                  >
                    + Voeg je eerste product toe
                  </button>
                </div>
              ) : (
                customProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      prod.active
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-slate-900/50 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${
                            prod.active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {prod.active ? 'Actief in winkel' : 'Verborgen'}
                        </span>
                        <h4 className="text-base font-bold text-white">{prod.name}</h4>
                        {prod.description && (
                          <p className="text-xs text-slate-400 mt-0.5">{prod.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 cursor-pointer"
                          title="Bewerken"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCustomProduct(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 cursor-pointer"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Huurprijs</span>
                        <span className="font-bold text-cyan-300 text-sm">€{prod.price.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[10px]">Beschikbaar</span>
                        <span className="font-bold text-white text-sm">{prod.stock} stuks</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            SUB-TAB: TARIEVEN & DAGEN (ZELF OPHALEN UITHOORN FOCUS)
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
                    Stel in hoeveel dagen klanten maximaal kunnen huren voor ophalen & retourneren in Uithoorn.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                </div>

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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Weekend Factor (1.0 = Weekend Voordeel)
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
                </div>

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
                </div>
              </div>
            </div>

            {/* Card 2: Koptelefoons Voorraad & Prijzen */}
            <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-800">
                <Headphones className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white font-display">
                  Voorraad & Basistarieven in Uithoorn
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Totale Magazijnvoorraad Koptelefoons
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Prijs Extra Zender (€/kanaal)
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

                {/* Pickup highlight */}
                <div className="sm:col-span-2 p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div>
                    <span className="font-bold block text-white">Geen PostNL verzending actief</span>
                    <span>Klanten halen altijd gratis zelf op in Uithoorn en omstreken.</span>
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
                      Staffelkortingen per Koptelefoon
                    </h2>
                    <p className="text-xs text-slate-400">
                      Prijs per koptelefoon daalt automatisch bij grotere groepen.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddTier}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded-lg hover:bg-cyan-900/60 transition-colors cursor-pointer"
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
                      <label className="text-[11px] text-slate-500 block mb-1">Label</label>
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
                      <label className="text-[11px] text-slate-500 block mb-1">Tot (leeg = ∞)</label>
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
                      <label className="text-[11px] text-slate-500 block mb-1">Prijs per stuk (€)</label>
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
                <span>Instellingen & Tarieven Opslaan</span>
              </button>
            </div>
          </form>
        )}

        {/* ============================================================
            SUB-TAB: KLANTENSERVICE CHAT (2-WEG LIVE COMMUNICATIE)
           ============================================================ */}
        {adminSubTab === 'berichten' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 rounded-3xl border border-slate-800 p-6 min-h-[550px]">
            {/* Conversation sidebar */}
            <div className="lg:col-span-4 border-r border-slate-800 pr-4 space-y-3">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">Inkomende Klantberichten</h3>
                <p className="text-xs text-slate-400">Directe chatvragen van klanten in Uithoorn</p>
              </div>

              {adminConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-pink-400" />
                  Nog geen actieve chatgesprekken. Zodra een klant via de website chat, verschijnt het gesprek hier live!
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[460px]">
                  {adminConversations.map((conv) => {
                    const isSelected = (activeConversationId || adminConversations[0]?.id) === conv.id;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConversationId(conv.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-950 border-pink-500/80 shadow-md'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white truncate">
                            {conv.customerName || 'Klant'}
                          </span>
                          {conv.unreadByAdmin > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold">
                              {conv.unreadByAdmin} nieuw
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{conv.lastMessage || 'Geen tekst'}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                          {conv.customerEmail}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Conversation Chat Window */}
            <div className="lg:col-span-8 flex flex-col justify-between pl-2">
              {activeConv ? (
                <>
                  {/* Chat header */}
                  <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        <span>{activeConv.customerName}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {activeConv.customerEmail}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">Klant uit regio Uithoorn en omstreken</p>
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="py-4 space-y-3 overflow-y-auto max-h-[380px] min-h-[300px]">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-xs text-slate-500 py-12">
                        Geen eerdere berichten in dit gesprek. Stuur hieronder een antwoord.
                      </div>
                    ) : (
                      chatMessages.map((msg) => {
                        const isAdminMsg = msg.senderRole === 'admin';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] text-slate-500 mb-0.5">
                              {isAdminMsg ? 'Jij (Silence Disco Uithoorn)' : msg.senderName}
                            </span>
                            <div
                              className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                                isAdminMsg
                                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-tr-none'
                                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                              <span className="text-[9px] opacity-70 mt-1 block text-right font-mono">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendAdminReply} className="pt-3 border-t border-slate-800 flex gap-2">
                    <input
                      type="text"
                      placeholder="Typ een antwoord naar de klant..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                    <button
                      type="submit"
                      disabled={!replyInput.trim()}
                      className="px-5 py-2.5 bg-pink-500 hover:bg-pink-400 disabled:opacity-30 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Versturen</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-xs text-slate-500 py-16">
                  <MessageSquare className="w-10 h-10 text-slate-600 mb-2" />
                  Selecteer een gesprek aan de linkerkant om berichten te lezen en te beantwoorden.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            SUB-TAB: PAKKETTEN & AANBIEDINGEN
           ============================================================ */}
        {adminSubTab === 'pakketten' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  Pakketten & Aanbiedingen Beheren
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Pas pakketprijzen, aantallen koptelefoons, huurdagen en teksten aan.
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

            {/* Offer editor */}
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
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveOffer} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Titel van Pakket *</label>
                      <input
                        type="text"
                        required
                        value={offerFormData.title}
                        onChange={(e) => setOfferFormData({ ...offerFormData, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Badge</label>
                      <input
                        type="text"
                        value={offerFormData.badge}
                        onChange={(e) => setOfferFormData({ ...offerFormData, badge: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Actieprijs (€)</label>
                      <input
                        type="number"
                        min="0"
                        value={offerFormData.fixedPrice}
                        onChange={(e) => setOfferFormData({ ...offerFormData, fixedPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Normale Prijs (€)</label>
                      <input
                        type="number"
                        min="0"
                        value={offerFormData.originalPrice}
                        onChange={(e) => setOfferFormData({ ...offerFormData, originalPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Aantal Koptelefoons</label>
                      <input
                        type="number"
                        min="1"
                        value={offerFormData.headphonesCount}
                        onChange={(e) => setOfferFormData({ ...offerFormData, headphonesCount: parseInt(e.target.value) || 1 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Aantal Zenders</label>
                      <input
                        type="number"
                        min="1"
                        max="3"
                        value={offerFormData.transmittersCount}
                        onChange={(e) => setOfferFormData({ ...offerFormData, transmittersCount: parseInt(e.target.value) || 1 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Korte Slagzin (Tagline)</label>
                      <input
                        type="text"
                        value={offerFormData.tagline}
                        onChange={(e) => setOfferFormData({ ...offerFormData, tagline: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setOfferFormData(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                    >
                      Sluiten
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Pakket Opslaan</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Offers cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="p-6 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {offer.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {offer.headphonesCount} koptelefoons
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{offer.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{offer.tagline}</p>
                    <div className="text-2xl font-black text-cyan-300 font-mono mb-4">
                      €{offer.fixedPrice.toFixed(2)}{' '}
                      <span className="text-xs text-slate-500 line-through font-normal">
                        €{offer.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleOpenEditOffer(offer)}
                      className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl cursor-pointer"
                    >
                      Bewerken
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteOffer(offer.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            SUB-TAB: BOEKINGEN & RESERVERINGEN (UITHOORN FOCUS)
           ============================================================ */}
        {adminSubTab === 'boekingen' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  Reserveringen & Afhaalbeheer Uithoorn
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Bekijk alle lokale boekingen, status van koffers en registreer handmatig reserveringen.
                </p>
              </div>

              <button
                onClick={() => setIsAddingManualBooking(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-indigo-400 hover:bg-indigo-300 rounded-xl cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Handmatige Reservering Invoeren</span>
              </button>
            </div>

            {/* Manual booking modal */}
            {isAddingManualBooking && (
              <div className="p-6 bg-slate-900 rounded-3xl border-2 border-indigo-500 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-white text-base">Handmatige Boeking Toevoegen</h3>
                  <button onClick={() => setIsAddingManualBooking(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateManualBooking} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Klantnaam *</label>
                    <input
                      type="text"
                      required
                      value={manualBookingData.customerName}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, customerName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">E-mail *</label>
                    <input
                      type="email"
                      required
                      value={manualBookingData.email}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Woonplaats / Omstreken</label>
                    <input
                      type="text"
                      value={manualBookingData.city}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Aantal Koptelefoons</label>
                    <input
                      type="number"
                      min="1"
                      value={manualBookingData.headphonesCount}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, headphonesCount: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Feestdatum</label>
                    <input
                      type="date"
                      value={manualBookingData.eventDate}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, eventDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Gewenst Ophaalmoment</label>
                    <input
                      type="text"
                      value={manualBookingData.pickupTimeSlot}
                      onChange={(e) => setManualBookingData({ ...manualBookingData, pickupTimeSlot: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingManualBooking(false)}
                      className="px-4 py-2 text-slate-400 hover:text-white"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Reservering Opslaan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Bookings table */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">ID & Datum</th>
                      <th className="px-6 py-4">Klant & Locatie</th>
                      <th className="px-6 py-4">Set & Zenders</th>
                      <th className="px-6 py-4">Totaal (incl. Borg)</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-mono">
                          <span className="font-bold text-white block">{b.id}</span>
                          <span className="text-[11px] text-slate-500">Feest: {b.eventDate}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white block">{b.customerName}</span>
                          <span className="text-[11px] text-slate-400">{b.city || 'Uithoorn'} · {b.phone}</span>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          <span className="text-cyan-300 font-bold block">{b.cart.headphonesCount} koptelefoons</span>
                          <span className="text-slate-400 text-[11px]">{b.cart.transmittersCount} zenders</span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-white">
                          €{b.pricingSummary.totalIncVat.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={b.orderStatus}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value as OrderStatus)}
                            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="confirmed">Bevestigd</option>
                            <option value="prepared">Klaargezet in Uithoorn</option>
                            <option value="ready_for_pickup">Klaar voor afhalen</option>
                            <option value="returned">Geretourneerd & Borg Vrij</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteBooking(b.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 cursor-pointer"
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
