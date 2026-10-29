import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  RentalSettings,
  DealOffer,
  RentalCart,
  PricingCalculation,
  BookingRecord,
  OrderStatus,
  PaymentStatus,
  CustomProduct,
  UserProfile,
  ChatMessage,
  Conversation,
} from '../types/rental';
import {
  DEFAULT_RENTAL_SETTINGS,
  DEFAULT_OFFERS,
  DEFAULT_BOOKINGS,
  DEFAULT_CUSTOM_PRODUCTS,
} from '../data/defaultSettings';
import { calculatePricing } from '../utils/pricingCalculator';
import { checkRangeAvailability } from '../utils/availability';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  isUserAdmin,
  syncUserProfile,
  subscribeToCustomProducts,
  saveCustomProduct,
  deleteCustomProduct as deleteCustomProductDb,
  subscribeToAdminConversations,
  subscribeToMessages,
  sendChatMessage,
  markConversationAsRead,
  saveBookingToFirestore,
} from '../firebase/chatService';
import { onAuthStateChanged, User } from 'firebase/auth';

export type ActiveTab = 'home' | 'aanbiedingen' | 'beschikbaarheid' | 'hoe-werkt-het' | 'beheer';

interface RentalContextType {
  settings: RentalSettings;
  offers: DealOffer[];
  bookings: BookingRecord[];
  customProducts: CustomProduct[];
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
  
  // Custom Products CRUD
  addCustomProduct: (product: CustomProduct) => Promise<void>;
  updateCustomProduct: (id: string, updated: Partial<CustomProduct>) => Promise<void>;
  deleteCustomProduct: (id: string) => Promise<void>;
  setProductCountInCart: (productId: string, count: number) => void;

  // Offers
  updateOffer: (id: string, updated: Partial<DealOffer>) => void;
  addOffer: (offer: DealOffer) => void;
  deleteOffer: (id: string) => void;
  resetOffers: () => void;
  applyOffer: (offerId: string) => void;
  clearOffer: () => void;

  // Cart operations
  setHeadphonesCount: (count: number) => void;
  setTransmittersCount: (count: number) => void;
  setDates: (startDate: string, eventDate: string, returnDate: string, isWeekend?: boolean) => void;
  setRentalDays: (days: number) => void;
  setIsWeekend: (isWeekend: boolean) => void;
  setIncludeDJCables: (include: boolean) => void;
  setPromoCode: (code: string) => void;

  // Bookings
  isBookingModalOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
  addBooking: (booking: BookingRecord) => Promise<void>;
  updateBookingStatus: (id: string, orderStatus: OrderStatus, paymentStatus?: PaymentStatus) => void;
  deleteBooking: (id: string) => void;
  latestConfirmedBooking: BookingRecord | null;
  setLatestConfirmedBooking: (booking: BookingRecord | null) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Authentication & Accounts
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  handleGoogleLogin: () => Promise<void>;
  handleDemoLogin: (role: 'customer' | 'admin', name?: string, email?: string) => void;
  handleLogout: () => Promise<void>;

  // Real-time Chat
  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (open: boolean) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  adminConversations: Conversation[];
  chatMessages: ChatMessage[];
  unreadChatCount: number;
  handleSendMessage: (text: string, convId?: string) => Promise<void>;
  openChatForCustomer: (convId?: string) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

const SETTINGS_KEY = 'silentgroove_rental_settings_v2';
const OFFERS_KEY = 'silentgroove_offers_v2';
const BOOKINGS_KEY = 'silentgroove_bookings_v2';
const PRODUCTS_KEY = 'silentgroove_custom_products_v2';
const DEMO_USER_KEY = 'silentgroove_demo_user_v2';

const getInitialDates = () => {
  const today = new Date();
  const nextFriday = new Date(today);
  const dayOfWeek = today.getDay();
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

  // Settings
  const [settings, setSettings] = useState<RentalSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_RENTAL_SETTINGS;
  });

  // Custom Products (managed by owner)
  const [customProducts, setCustomProducts] = useState<CustomProduct[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CUSTOM_PRODUCTS;
  });

  // Offers
  const [offers, setOffers] = useState<DealOffer[]>(() => {
    try {
      const saved = localStorage.getItem(OFFERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_OFFERS;
  });

  // Bookings
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BOOKINGS;
  });

  // Cart: Always pickup in Uithoorn
  const [cart, setCart] = useState<RentalCart>({
    headphonesCount: 25,
    transmittersCount: 2,
    startDate: initialDates.startDate,
    eventDate: initialDates.eventDate,
    returnDate: initialDates.returnDate,
    rentalDays: 3,
    isWeekend: true,
    selectedProducts: {},
    includeDJCables: true,
    deliveryType: 'pickup',
    appliedOfferId: null,
    promoCode: '',
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [latestConfirmedBooking, setLatestConfirmedBooking] = useState<BookingRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [demoUser, setDemoUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Chat state
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [adminConversations, setAdminConversations] = useState<Conversation[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setDemoUser(null);
        localStorage.removeItem(DEMO_USER_KEY);
        await syncUserProfile(user);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Custom Products from Firestore
  useEffect(() => {
    const unsub = subscribeToCustomProducts((remoteProds) => {
      if (remoteProds && remoteProds.length > 0) {
        setCustomProducts(remoteProds);
        try {
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(remoteProds));
        } catch {
          // ignore
        }
      }
    });
    return () => unsub();
  }, []);

  // Determine effective user profile & admin state
  const userProfile: UserProfile | null = useMemo(() => {
    if (currentUser) {
      const admin = isUserAdmin(currentUser);
      return {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Klant',
        role: admin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
    }
    return demoUser;
  }, [currentUser, demoUser]);

  const isAdmin = useMemo(() => {
    if (currentUser) return isUserAdmin(currentUser);
    if (demoUser) return demoUser.role === 'admin';
    return false;
  }, [currentUser, demoUser]);

  // Subscribe to Admin Conversations if admin
  useEffect(() => {
    if (isAdmin) {
      const unsub = subscribeToAdminConversations((convs) => {
        setAdminConversations(convs);
      });
      return () => unsub();
    }
  }, [isAdmin]);

  // Determine current active chat conversation ID
  const effectiveConversationId = useMemo(() => {
    if (isAdmin) {
      return activeConversationId || (adminConversations.length > 0 ? adminConversations[0].id : null);
    }
    if (userProfile) {
      return `customer_${userProfile.uid}`;
    }
    // Guest customer without login uses a stable local session ID
    let guestId = localStorage.getItem('silentgroove_guest_chat_id');
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('silentgroove_guest_chat_id', guestId);
    }
    return `customer_${guestId}`;
  }, [isAdmin, activeConversationId, adminConversations, userProfile]);

  // Subscribe to messages in current active conversation
  useEffect(() => {
    if (!effectiveConversationId) return;
    const unsub = subscribeToMessages(effectiveConversationId, (msgs) => {
      setChatMessages(msgs);
    });
    return () => unsub();
  }, [effectiveConversationId]);

  // Mark conversation read when chat is open
  useEffect(() => {
    if (isChatDrawerOpen && effectiveConversationId) {
      markConversationAsRead(effectiveConversationId, isAdmin ? 'admin' : 'customer');
    }
  }, [isChatDrawerOpen, effectiveConversationId, isAdmin]);

  // Compute unread count for badge
  const unreadChatCount = useMemo(() => {
    if (isAdmin) {
      return adminConversations.reduce((sum, c) => sum + (c.unreadByAdmin || 0), 0);
    }
    // For customer
    return chatMessages.filter((m) => m.senderRole === 'admin' && !m.isRead).length;
  }, [isAdmin, adminConversations, chatMessages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Custom Products CRUD
  const addCustomProduct = async (product: CustomProduct) => {
    setCustomProducts((prev) => {
      const next = [product, ...prev];
      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast(`Product "${product.name}" toegevoegd!`);
    try {
      await saveCustomProduct(product);
    } catch {
      // Saved locally
    }
  };

  const updateCustomProduct = async (id: string, updated: Partial<CustomProduct>) => {
    let updatedProd: CustomProduct | undefined;
    setCustomProducts((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          updatedProd = { ...p, ...updated };
          return updatedProd;
        }
        return p;
      });
      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Product bijgewerkt!');
    if (updatedProd) {
      try {
        await saveCustomProduct(updatedProd);
      } catch {
        // Saved locally
      }
    }
  };

  const deleteCustomProduct = async (id: string) => {
    setCustomProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    // Remove from cart if present
    setCart((prev) => {
      const nextProds = { ...prev.selectedProducts };
      delete nextProds[id];
      return { ...prev, selectedProducts: nextProds };
    });
    showToast('Product verwijderd');
    try {
      await deleteCustomProductDb(id);
    } catch {
      // Deleted locally
    }
  };

  const setProductCountInCart = (productId: string, count: number) => {
    const prod = customProducts.find((p) => p.id === productId);
    const maxStock = prod ? prod.stock : 99;
    const clamped = Math.max(0, Math.min(maxStock, count));

    setCart((prev) => {
      const next = { ...prev.selectedProducts };
      if (clamped === 0) {
        delete next[productId];
      } else {
        next[productId] = clamped;
      }
      return { ...prev, selectedProducts: next };
    });
  };

  // Settings
  const updateSettings = (newSettings: RentalSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch {
      // ignore
    }
    showToast('Tarieven en instellingen succesvol bijgewerkt!');
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

  // Offers
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

  const applyOffer = (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    setCart((prev) => ({
      ...prev,
      headphonesCount: offer.headphonesCount,
      transmittersCount: offer.transmittersCount,
      rentalDays: offer.rentalDurationDays,
      isWeekend: offer.isWeekendDeal,
      selectedProducts: {},
      includeDJCables: offer.includeDJCables,
      deliveryType: 'pickup',
      appliedOfferId: offer.id,
      promoCode: '',
    }));
    setActiveTab('home');
    showToast(`Pakket "${offer.title}" toegepast op de calculator!`);
  };

  const clearOffer = () => {
    setCart((prev) => ({ ...prev, appliedOfferId: null }));
  };

  // Booking operations
  const addBooking = async (booking: BookingRecord) => {
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
    showToast(`Reservering #${booking.id} bevestigd! Klaar voor afhalen in Uithoorn.`);
    try {
      await saveBookingToFirestore(booking);
    } catch {
      // Saved locally
    }
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
    showToast(`Status bijgewerkt naar "${orderStatus}"`);
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
    const minH = settings.minHeadphones || 5;
    const maxH = Math.min(settings.totalStockHeadphones, settings.maxHeadphonesPerOrder || settings.totalStockHeadphones);
    const clamped = Math.max(minH, Math.min(maxH, count));
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
    const start = new Date(startDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const rawDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    const minD = settings.minDays || 1;
    const maxD = settings.maxDays || 14;
    const days = Math.max(minD, Math.min(maxD, rawDays));

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
    const minD = settings.minDays || 1;
    const maxD = settings.maxDays || 14;
    setCart((prev) => ({
      ...prev,
      rentalDays: Math.max(minD, Math.min(maxD, days)),
    }));
  };

  const setIsWeekend = (isWeekend: boolean) => {
    setCart((prev) => ({
      ...prev,
      isWeekend,
    }));
  };

  const setIncludeDJCables = (includeDJCables: boolean) => {
    setCart((prev) => ({ ...prev, includeDJCables }));
  };

  const setPromoCode = (code: string) => {
    setCart((prev) => ({ ...prev, promoCode: code }));
  };

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  // Authentication actions
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
      showToast('Succesvol ingelogd met Google!');
    } catch {
      showToast('Inloggen geannuleerd of mislukt');
    }
  };

  const handleDemoLogin = (role: 'customer' | 'admin', name?: string, email?: string) => {
    const demoProfile: UserProfile = {
      uid: role === 'admin' ? 'admin_demo_uithoorn' : 'customer_' + Math.random().toString(36).substring(2, 7),
      email: email || (role === 'admin' ? 'teisco181@gmail.com' : 'klant.uithoorn@gmail.com'),
      displayName: name || (role === 'admin' ? 'Beheerder Uithoorn' : 'Klant Uithoorn'),
      role,
      city: 'Uithoorn',
      createdAt: new Date().toISOString(),
    };
    setDemoUser(demoProfile);
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoProfile));
    } catch {
      // ignore
    }
    setIsAuthModalOpen(false);
    showToast(role === 'admin' ? 'Ingelogd als Beheerder (Uithoorn)' : 'Ingelogd als Klant!');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    setDemoUser(null);
    localStorage.removeItem(DEMO_USER_KEY);
    showToast('Je bent uitgelogd');
  };

  // Chat message sending
  const handleSendMessage = async (text: string, convId?: string) => {
    const targetConvId = convId || effectiveConversationId;
    if (!targetConvId || !text.trim()) return;

    const senderRole = isAdmin ? 'admin' : 'customer';
    const senderName = userProfile?.displayName || (isAdmin ? 'Silence Disco Uithoorn' : 'Klant Uithoorn');
    const senderEmail = userProfile?.email || (isAdmin ? 'teisco181@gmail.com' : 'klant@uithoorn.nl');
    const senderId = userProfile?.uid || 'guest';

    // Local instant preview if needed
    const newMsg: ChatMessage = {
      id: 'local_' + Date.now(),
      conversationId: targetConvId,
      senderId,
      senderName,
      senderEmail,
      senderRole,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    try {
      await sendChatMessage({
        conversationId: targetConvId,
        senderId,
        senderName,
        senderEmail,
        senderRole,
        text: text.trim(),
        customerName: senderRole === 'customer' ? senderName : undefined,
        customerEmail: senderRole === 'customer' ? senderEmail : undefined,
      });
    } catch (err) {
      console.warn('Real-time chat sent locally, syncing with Firestore:', err);
    }
  };

  const openChatForCustomer = (convId?: string) => {
    if (convId) setActiveConversationId(convId);
    setIsChatDrawerOpen(true);
  };

  // Calculate live pricing with custom products and €0 shipping
  const pricing = useMemo(() => {
    return calculatePricing(cart, settings, offers, customProducts);
  }, [cart, settings, offers, customProducts]);

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
        customProducts,
        cart,
        pricing,
        availabilityCheck,
        activeTab,
        setActiveTab,
        updateSettings,
        resetSettings,
        addCustomProduct,
        updateCustomProduct,
        deleteCustomProduct,
        setProductCountInCart,
        updateOffer,
        addOffer,
        deleteOffer,
        resetOffers,
        applyOffer,
        clearOffer,
        setHeadphonesCount,
        setTransmittersCount,
        setDates,
        setRentalDays,
        setIsWeekend,
        setIncludeDJCables,
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
        currentUser,
        userProfile,
        isAdmin,
        isAuthModalOpen,
        setIsAuthModalOpen,
        handleGoogleLogin,
        handleDemoLogin,
        handleLogout,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
        activeConversationId,
        setActiveConversationId,
        adminConversations,
        chatMessages,
        unreadChatCount,
        handleSendMessage,
        openChatForCustomer,
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
