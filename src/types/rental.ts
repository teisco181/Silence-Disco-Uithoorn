export interface TierPricing {
  minCount: number;
  maxCount: number | null; // null means and above
  pricePerHeadphone: number;
  label: string;
}

export interface CustomProduct {
  id: string;
  name: string;
  description: string;
  price: number; // Prijs per huurperiode
  stock: number; // Aantal beschikbaar
  active: boolean;
  createdAt?: string;
}

export interface RentalSettings {
  totalStockHeadphones: number;
  minHeadphones: number;
  maxHeadphonesPerOrder: number;
  minDays: number;
  maxDays: number;
  basePricePerHeadphone: number;
  tierPricing: TierPricing[];
  pricePerTransmitter: number; // 1e zender vaak inclusief, extra zenders meerprijs
  defaultDeposit: number;
  weekendSurchargeMultiplier: number;
  multidayExtraDayFactor: number;
  vatPercentage: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  pickupLocationAddress: string;
  pickupCity: string;
  serviceArea: string; // "Uithoorn en omstreken"
  adminPassword?: string; // Beveiligingswachtwoord voor instellingenmenu
}

export interface DealOffer {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  headphonesCount: number;
  transmittersCount: number;
  customProductIds?: string[];
  includeDJCables: boolean;
  rentalDurationDays: number;
  isWeekendDeal: boolean;
  fixedPrice: number;
  originalPrice: number;
  description: string;
  features: string[];
  active: boolean;
  popular?: boolean;
}

export interface RentalCart {
  headphonesCount: number;
  transmittersCount: number; // 1, 2, of 3
  startDate: string; // YYYY-MM-DD
  eventDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
  rentalDays: number;
  isWeekend: boolean;
  selectedProducts: Record<string, number>; // productId -> quantity
  includeDJCables: boolean;
  deliveryType: 'pickup'; // Altijd zelf ophalen in Uithoorn
  appliedOfferId: string | null;
  promoCode: string;
}

export type PaymentMethod = 'ideal' | 'creditcard' | 'bancontact' | 'invoice' | 'cash_at_pickup';
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'cancelled';
export type OrderStatus = 'confirmed' | 'prepared' | 'ready_for_pickup' | 'returned';

export interface BookingRecord {
  id: string;
  userId?: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  city: string; // Regio Uithoorn en omstreken
  pickupTimeSlot?: string;
  startDate: string;
  eventDate: string;
  returnDate: string;
  rentalDays: number;
  deliveryType: 'pickup';
  notes?: string;
  cart: RentalCart;
  pricingSummary: PricingCalculation;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  selectedBank?: string;
  transactionId: string;
  orderStatus: OrderStatus;
}

export interface CustomProductLineItem {
  id: string;
  name: string;
  count: number;
  unitPrice: number;
  subtotal: number;
}

export interface PricingCalculation {
  headphonesCount: number;
  headphonesUnitPrice: number;
  headphonesSubtotal: number;
  transmittersCount: number;
  transmittersSubtotal: number;
  customProductsSubtotal: number;
  customProductsBreakdown: CustomProductLineItem[];
  cablesSubtotal: number;
  durationMultiplier: number;
  rentalSubtotal: number;
  discountAmount: number;
  appliedDiscountName?: string;
  shippingCost: number; // Always 0 (Zelf ophalen in Uithoorn)
  depositAmount: number;
  subtotalExVat: number;
  vatAmount: number;
  totalIncVat: number;
  pricePerPerson: number;
}

export interface DayAvailability {
  date: string;
  bookedCount: number;
  availableCount: number;
  totalStock: number;
  status: 'available' | 'low' | 'sold_out';
}

// User accounts & Chat
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  city?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail?: string;
  senderRole: 'customer' | 'admin';
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  lastMessage: string;
  lastSenderRole: 'customer' | 'admin';
  lastMessageAt: string;
  unreadByAdmin: number;
  unreadByCustomer: number;
  updatedAt: string;
}
