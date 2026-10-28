import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  RentalSettings,
  DealOffer,
  RentalCart,
  PricingCalculation,
  ReservationDetails,
} from '../types/rental';
import {
  DEFAULT_RENTAL_SETTINGS,
  DEFAULT_OFFERS,
} from '../data/defaultSettings';
import { calculatePricing } from '../utils/pricingCalculator';

export type ActiveTab = 'home' | 'aanbiedingen' | 'hoe-werkt-het' | 'beheer';

interface RentalContextType {
  settings: RentalSettings;
  offers: DealOffer[];
  cart: RentalCart;
  pricing: PricingCalculation;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  updateSettings: (newSettings: RentalSettings) => void;
  resetSettings: () => void;
  updateOffer: (id: string, updated: Partial<DealOffer>) => void;
  addOffer: (offer: DealOffer) => void;
  deleteOffer: (id: string) => void;
  resetOffers: () => void;
  setHeadphonesCount: (count: number) => void;
  setTransmittersCount: (count: number) => void;
  setRentalDays: (days: number) => void;
  setIsWeekend: (isWeekend: boolean) => void;
  setDiscoLightsCount: (count: number) => void;
  setPowerbanksCount: (count: number) => void;
  setIncludeDJCables: (include: boolean) => void;
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  applyOffer: (offerId: string) => void;
  clearOffer: () => void;
  setPromoCode: (code: string) => void;
  isBookingModalOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
  confirmedReservation: ReservationDetails | null;
  setConfirmedReservation: (reservation: ReservationDetails | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

const SETTINGS_KEY = 'silentgroove_rental_settings_v1';
const OFFERS_KEY = 'silentgroove_offers_v1';

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RentalSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_RENTAL_SETTINGS;
  });

  const [offers, setOffers] = useState<DealOffer[]>(() => {
    try {
      const saved = localStorage.getItem(OFFERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_OFFERS;
  });

  const [cart, setCart] = useState<RentalCart>({
    headphonesCount: 25,
    transmittersCount: 2,
    rentalDays: 1,
    isWeekend: false,
    discoLightsCount: 1,
    powerbanksCount: 0,
    includeDJCables: true,
    deliveryType: 'delivery',
    appliedOfferId: null,
    promoCode: '',
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<ReservationDetails | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const updateSettings = (newSettings: RentalSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch {
      // ignore
    }
    showToast('Tarieven en voorraad succesvol bijgewerkt!');
  };

  const resetSettings = () => {
    setSettings(DEFAULT_RENTAL_SETTINGS);
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch {
      // ignore
    }
    showToast('Standaard instellingen en prijzen hersteld');
  };

  const updateOffer = (id: string, updated: Partial<DealOffer>) => {
    setOffers((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      try {
        localStorage.setItem(OFFERS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Aanbieding bijgewerkt!');
  };

  const addOffer = (offer: DealOffer) => {
    setOffers((prev) => {
      const next = [offer, ...prev];
      try {
        localStorage.setItem(OFFERS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Nieuwe aanbieding toegevoegd!');
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(OFFERS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Aanbieding verwijderd');
  };

  const resetOffers = () => {
    setOffers(DEFAULT_OFFERS);
    try {
      localStorage.removeItem(OFFERS_KEY);
    } catch {
      // ignore
    }
    showToast('Standaard aanbiedingen hersteld');
  };

  // Cart operations
  const setHeadphonesCount = (count: number) => {
    const clamped = Math.max(
      settings.minHeadphones,
      Math.min(settings.totalStockHeadphones, count)
    );
    setCart((prev) => ({
      ...prev,
      headphonesCount: clamped,
      appliedOfferId: null, // clear preset lock if user customized
    }));
  };

  const setTransmittersCount = (count: number) => {
    const clamped = Math.max(1, Math.min(3, count));
    setCart((prev) => ({
      ...prev,
      transmittersCount: clamped,
      appliedOfferId: null,
    }));
  };

  const setRentalDays = (days: number) => {
    setCart((prev) => ({
      ...prev,
      rentalDays: Math.max(1, days),
    }));
  };

  const setIsWeekend = (isWeekend: boolean) => {
    setCart((prev) => ({
      ...prev,
      isWeekend,
    }));
  };

  const setDiscoLightsCount = (count: number) => {
    setCart((prev) => ({
      ...prev,
      discoLightsCount: Math.max(0, count),
      appliedOfferId: null,
    }));
  };

  const setPowerbanksCount = (count: number) => {
    setCart((prev) => ({
      ...prev,
      powerbanksCount: Math.max(0, count),
      appliedOfferId: null,
    }));
  };

  const setIncludeDJCables = (includeDJCables: boolean) => {
    setCart((prev) => ({ ...prev, includeDJCables }));
  };

  const setDeliveryType = (deliveryType: 'delivery' | 'pickup') => {
    setCart((prev) => ({ ...prev, deliveryType }));
  };

  const applyOffer = (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    setCart({
      headphonesCount: offer.headphonesCount,
      transmittersCount: offer.transmittersCount,
      rentalDays: offer.rentalDurationDays,
      isWeekend: offer.isWeekendDeal,
      discoLightsCount: offer.discoLightsCount,
      powerbanksCount: offer.powerbanksCount,
      includeDJCables: offer.includeDJCables,
      deliveryType: 'delivery',
      appliedOfferId: offer.id,
      promoCode: '',
    });
    setActiveTab('home');
    showToast(`Aanbieding "${offer.title}" toegepast op de calculator!`);
  };

  const clearOffer = () => {
    setCart((prev) => ({ ...prev, appliedOfferId: null }));
  };

  const setPromoCode = (code: string) => {
    setCart((prev) => ({ ...prev, promoCode: code }));
  };

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  // Compute live price
  const pricing = useMemo(() => {
    return calculatePricing(cart, settings, offers);
  }, [cart, settings, offers]);

  return (
    <RentalContext.Provider
      value={{
        settings,
        offers,
        cart,
        pricing,
        activeTab,
        setActiveTab,
        updateSettings,
        resetSettings,
        updateOffer,
        addOffer,
        deleteOffer,
        resetOffers,
        setHeadphonesCount,
        setTransmittersCount,
        setRentalDays,
        setIsWeekend,
        setDiscoLightsCount,
        setPowerbanksCount,
        setIncludeDJCables,
        setDeliveryType,
        applyOffer,
        clearOffer,
        setPromoCode,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        confirmedReservation,
        setConfirmedReservation,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = (): RentalContextType => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
};
