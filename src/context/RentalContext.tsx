import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  RentalSettings,
  DealOffer,
  RentalCart,
  PricingCalculation,
  BookingRecord,
  OrderStatus,
  PaymentStatus,
} from '../types/rental';
import {
  DEFAULT_RENTAL_SETTINGS,
  DEFAULT_OFFERS,
  DEFAULT_BOOKINGS,
} from '../data/defaultSettings';
import { calculatePricing } from '../utils/pricingCalculator';
import { checkRangeAvailability, getAvailabilityForDate } from '../utils/availability';

export type ActiveTab = 'home' | 'aanbiedingen' | 'beschikbaarheid' | 'hoe-werkt-het' | 'beheer';

interface RentalContextType {
  settings: RentalSettings;
  offers: DealOffer[];
  bookings: BookingRecord[];
  cart: RentalCart;
  pricing: PricingCalculation;
  availabilityCheck: {
    isAvailable: boolean;
    minAvailable: number;
    bottleneckDate?: string;
    bottleneckBooked?: number;
  };
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
  setDates: (startDate: string, eventDate: string, returnDate: string, isWeekend?: boolean) => void;
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
  addBooking: (booking: BookingRecord) => void;
  updateBookingStatus: (id: string, orderStatus: OrderStatus, paymentStatus?: PaymentStatus) => void;
  deleteBooking: (id: string) => void;
  latestConfirmedBooking: BookingRecord | null;
  setLatestConfirmedBooking: (booking: BookingRecord | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

const SETTINGS_KEY = 'silentgroove_rental_settings_v1';
const OFFERS_KEY = 'silentgroove_offers_v1';
const BOOKINGS_KEY = 'silentgroove_bookings_v1';

// Default initial dates (Upcoming Friday through Monday)
const getInitialDates = () => {
  const today = new Date();
  // Find next Friday
  const nextFriday = new Date(today);
  const dayOfWeek = today.getDay(); // 0 is Sunday, 5 is Friday
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
  nextFriday.setDate(today.getDate() + daysUntilFriday);

  const eventSaturday = new Date(nextFriday);
  eventSaturday.setDate(nextFriday.getDate() + 1);

  const returnMonday = new Date(nextFriday);
  returnMonday.setDate(nextFriday.getDate() + 3);

  return {
    startDate: nextFriday.toISOString().split('T')[0],
    eventDate: eventSaturday.toISOString().split('T')[0],
    returnDate: returnMonday.toISOString().split('T')[0],
  };
};

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialDates = useMemo(() => getInitialDates(), []);

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

  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BOOKINGS;
  });

  const [cart, setCart] = useState<RentalCart>({
    headphonesCount: 25,
    transmittersCount: 2,
    startDate: initialDates.startDate,
    eventDate: initialDates.eventDate,
    returnDate: initialDates.returnDate,
    rentalDays: 3,
    isWeekend: true,
    discoLightsCount: 1,
    powerbanksCount: 0,
    includeDJCables: true,
    deliveryType: 'delivery',
    appliedOfferId: null,
    promoCode: '',
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [latestConfirmedBooking, setLatestConfirmedBooking] = useState<BookingRecord | null>(null);
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

  // Booking operations
  const addBooking = (booking: BookingRecord) => {
    setBookings((prev) => {
      const next = [booking, ...prev];
      try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setLatestConfirmedBooking(booking);
    showToast(`Boeking #${booking.id} succesvol voltooid en betaald!`);
  };

  const updateBookingStatus = (id: string, orderStatus: OrderStatus, paymentStatus?: PaymentStatus) => {
    setBookings((prev) => {
      const next = prev.map((b) =>
        b.id === id
          ? {
              ...b,
              orderStatus,
              ...(paymentStatus ? { paymentStatus } : {}),
            }
          : b
      );
      try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast(`Boekingsstatus bijgewerkt naar "${orderStatus}"`);
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => {
      const next = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Boeking verwijderd');
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
      appliedOfferId: null,
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

  const setDates = (startDate: string, eventDate: string, returnDate: string, isWeekend = true) => {
    // Calculate days between start and return
    const start = new Date(startDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    setCart((prev) => ({
      ...prev,
      startDate,
      eventDate,
      returnDate,
      rentalDays: days,
      isWeekend,
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

    setCart((prev) => ({
      ...prev,
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
    }));
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

  // Compute availability for current cart selection
  const availabilityCheck = useMemo(() => {
    return checkRangeAvailability(
      cart.startDate,
      cart.returnDate,
      cart.headphonesCount,
      bookings,
      settings.totalStockHeadphones
    );
  }, [cart.startDate, cart.returnDate, cart.headphonesCount, bookings, settings.totalStockHeadphones]);

  return (
    <RentalContext.Provider
      value={{
        settings,
        offers,
        bookings,
        cart,
        pricing,
        availabilityCheck,
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
        setDates,
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
        addBooking,
        updateBookingStatus,
        deleteBooking,
        latestConfirmedBooking,
        setLatestConfirmedBooking,
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
