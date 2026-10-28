export interface TierPricing {
  minCount: number;
  maxCount: number | null; // null means and above
  pricePerHeadphone: number;
  label: string;
}

export interface RentalSettings {
  totalStockHeadphones: number;
  minHeadphones: number;
  basePricePerHeadphone: number;
  tierPricing: TierPricing[];
  pricePerTransmitter: number;
  pricePerDiscoLight: number;
  pricePowerbank: number;
  shippingCostRoundtrip: number;
  defaultDeposit: number;
  weekendSurchargeMultiplier: number;
  vatPercentage: number;
}

export interface DealOffer {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  headphonesCount: number;
  transmittersCount: number;
  discoLightsCount: number;
  powerbanksCount: number;
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
  transmittersCount: number; // 1, 2, or 3
  startDate: string; // YYYY-MM-DD
  eventDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
  rentalDays: number;
  isWeekend: boolean;
  discoLightsCount: number;
  powerbanksCount: number;
  includeDJCables: boolean;
  deliveryType: 'delivery' | 'pickup';
  appliedOfferId: string | null;
  promoCode: string;
}

export type PaymentMethod = 'ideal' | 'creditcard' | 'bancontact' | 'invoice' | 'applepay';
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'cancelled';
export type OrderStatus = 'confirmed' | 'prepared' | 'shipped' | 'returned';

export interface BookingRecord {
  id: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  startDate: string;
  eventDate: string;
  returnDate: string;
  rentalDays: number;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  postalCode?: string;
  city?: string;
  notes?: string;
  cart: RentalCart;
  pricingSummary: PricingCalculation;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  selectedBank?: string;
  transactionId: string;
  orderStatus: OrderStatus;
}

export interface PricingCalculation {
  headphonesCount: number;
  headphonesUnitPrice: number;
  headphonesSubtotal: number;
  transmittersCount: number;
  transmittersSubtotal: number;
  discoLightsSubtotal: number;
  powerbanksSubtotal: number;
  cablesSubtotal: number;
  durationMultiplier: number;
  rentalSubtotal: number;
  discountAmount: number;
  appliedDiscountName?: string;
  shippingCost: number;
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
