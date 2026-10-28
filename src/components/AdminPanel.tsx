import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { RentalSettings, DealOffer, TierPricing } from '../types/rental';
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
    setActiveTab,
  } = useRental();

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
    setNewOffer({
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
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-950 text-slate-100 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
              <Settings className="w-4 h-4" />
              <span>Eigenaars & Beheerders Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Prijzen & Voorraad Beheer
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Pas hier het aantal beschikbare koptelefoons, tarieven per stuk, staffels en lopende aanbiedingen direct aan.
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

        {/* Informational tip */}
        <div className="mb-8 p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl flex items-start gap-3">
          <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-200 leading-relaxed">
            <strong>Realtime synchronisatie:</strong> Wijzigingen die je hier opslaat worden direct actief in de verhuurcalculator, de prijsstaffels en de boekingsmodule. Gegevens blijven veilig bewaard in jouw browser.
          </div>
        </div>

        {/* Main Settings Form */}
        <form onSubmit={handleSaveSettings} className="space-y-10">
          
          {/* Card 1: Voorraad & Basistarieven */}
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
                  Maximaal te selecteren in de calculator
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
                  Ondergrens voor een bestelling
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
                  Standaard tarief voor kleine aantallen
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
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Inclusief alle voedings- en audioadapters
                </span>
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
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Roterende RGB partylamp accessoire
                </span>
              </div>

              {/* Powerbank price */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Prijs per Powerbank (€)
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
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Voor buitengebruik in het park
                </span>
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
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Inclusief retourzegel voor de klant
                </span>
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
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Wordt teruggestort bij onbeschadigde teruggave
                </span>
              </div>

              {/* BTW Percentage */}
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
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Standaard Nederlands 21% tarief
                </span>
              </div>

            </div>
          </div>

          {/* Card 2: Volume Staffelkortingen */}
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
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
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

        {/* Section 3: Aanbiedingen Beheer */}
        <div className="mt-14 p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
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
                  className="text-xs text-slate-400 hover:text-slate-200"
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
                  <label className="block text-slate-300 mb-1">Korte slagzin / Tagline</label>
                  <input
                    type="text"
                    placeholder="bijv. De ultieme set voor een onvergetelijke avond"
                    value={newOffer.tagline}
                    onChange={(e) => setNewOffer({ ...newOffer, tagline: e.target.value })}
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
                  <label className="block text-slate-300 mb-1">Aantal zenders</label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={newOffer.transmittersCount}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, transmittersCount: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Aantal discolampen</label>
                  <input
                    type="number"
                    min="0"
                    value={newOffer.discoLightsCount}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, discoLightsCount: parseInt(e.target.value) || 0 })
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

          {/* List of current offers with quick edit */}
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
                      <span aria-hidden="true">·</span>
                      <span>{offer.discoLightsCount} discolamp(en)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Price editor */}
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

                    {/* Headphone count editor */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Koptelefoons:</span>
                      <input
                        type="number"
                        value={offer.headphonesCount}
                        onChange={(e) =>
                          updateOffer(offer.id, {
                            headphonesCount: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>

                    {/* Toggle active status */}
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

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => deleteOffer(offer.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
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

      </div>
    </div>
  );
};
