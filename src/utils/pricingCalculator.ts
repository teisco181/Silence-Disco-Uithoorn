import { RentalCart, RentalSettings, DealOffer, PricingCalculation, CustomProduct, CustomProductLineItem } from '../types/rental';
import { VALID_PROMO_CODES } from '../data/defaultSettings';

export function calculatePricing(
  cart: RentalCart,
  settings: RentalSettings,
  offers: DealOffer[],
  customProducts: CustomProduct[] = []
): PricingCalculation {
  // If an active special offer is applied
  const appliedOffer = cart.appliedOfferId
    ? offers.find((o) => o.id === cart.appliedOfferId && o.active)
    : null;

  let headphonesUnitPrice = settings.basePricePerHeadphone;
  // Determine unit price based on tiers
  const matchedTier = settings.tierPricing.find((tier) => {
    if (tier.maxCount === null) {
      return cart.headphonesCount >= tier.minCount;
    }
    return cart.headphonesCount >= tier.minCount && cart.headphonesCount <= tier.maxCount;
  });

  if (matchedTier) {
    headphonesUnitPrice = matchedTier.pricePerHeadphone;
  }

  const headphonesSubtotal = cart.headphonesCount * headphonesUnitPrice;
  
  // 1 transmitter is standard included in headphone sets; additional transmitters (e.g. 2 or 3 channels) cost pricePerTransmitter
  const extraTransmitters = Math.max(0, cart.transmittersCount - 1);
  const transmittersSubtotal = extraTransmitters * settings.pricePerTransmitter;

  // Custom products configured by admin
  const customProductsBreakdown: CustomProductLineItem[] = [];
  let customProductsSubtotal = 0;

  if (cart.selectedProducts) {
    for (const [prodId, count] of Object.entries(cart.selectedProducts)) {
      if (count > 0) {
        const prod = customProducts.find((p) => p.id === prodId && p.active);
        if (prod) {
          const itemSubtotal = count * prod.price;
          customProductsSubtotal += itemSubtotal;
          customProductsBreakdown.push({
            id: prod.id,
            name: prod.name,
            count,
            unitPrice: prod.price,
            subtotal: itemSubtotal,
          });
        }
      }
    }
  }

  const cablesSubtotal = 0; // DJ/telefoon aansluitkabels altijd gratis meegeleverd

  // Duration multiplier:
  // 1 day = 1x
  // Weekend = settings.weekendSurchargeMultiplier (bijv. 1.0x actietarief)
  // Multiday = 1 + (days - 1) * factor
  let durationMultiplier = 1;
  if (cart.rentalDays <= 1) {
    durationMultiplier = 1;
  } else if (cart.isWeekend) {
    durationMultiplier = settings.weekendSurchargeMultiplier;
  } else {
    const extraFactor = settings.multidayExtraDayFactor ?? 0.5;
    durationMultiplier = 1 + (cart.rentalDays - 1) * extraFactor;
  }

  let rentalSubtotal =
    (headphonesSubtotal + transmittersSubtotal + customProductsSubtotal + cablesSubtotal) *
    durationMultiplier;

  let discountAmount = 0;
  let appliedDiscountName = undefined;

  if (appliedOffer) {
    const theoreticalRegularPrice = rentalSubtotal;
    if (appliedOffer.fixedPrice < theoreticalRegularPrice) {
      discountAmount = Math.max(0, theoreticalRegularPrice - appliedOffer.fixedPrice);
      appliedDiscountName = `Aanbieding: ${appliedOffer.title}`;
    }
  }

  // Promo code discount
  const cleanCode = (cart.promoCode || '').trim().toUpperCase();
  if (cleanCode && VALID_PROMO_CODES[cleanCode]) {
    const promo = VALID_PROMO_CODES[cleanCode];
    if (promo.discountPercent) {
      const promoDiscount = (rentalSubtotal - discountAmount) * (promo.discountPercent / 100);
      discountAmount += promoDiscount;
      appliedDiscountName = appliedDiscountName
        ? `${appliedDiscountName} + ${promo.label}`
        : promo.label;
    } else if (promo.discountEuro) {
      discountAmount += promo.discountEuro;
      appliedDiscountName = appliedDiscountName
        ? `${appliedDiscountName} + ${promo.label}`
        : promo.label;
    }
  }

  // Ensure discount doesn't exceed subtotal
  discountAmount = Math.min(rentalSubtotal, Math.round(discountAmount * 100) / 100);

  // Zelf ophalen in Uithoorn = €0,- verzendkosten
  const shippingCost = 0;
  const depositAmount = settings.defaultDeposit;

  const subtotalExVat = Math.max(0, rentalSubtotal - discountAmount);
  const vatRate = settings.vatPercentage / 100;
  const vatAmount = Math.round((subtotalExVat - subtotalExVat / (1 + vatRate)) * 100) / 100;
  const totalIncVat = Math.round((subtotalExVat + shippingCost + depositAmount) * 100) / 100;

  const pricePerPerson =
    cart.headphonesCount > 0
      ? Math.round((subtotalExVat / cart.headphonesCount) * 100) / 100
      : 0;

  return {
    headphonesCount: cart.headphonesCount,
    headphonesUnitPrice,
    headphonesSubtotal,
    transmittersCount: cart.transmittersCount,
    transmittersSubtotal,
    customProductsSubtotal,
    customProductsBreakdown,
    cablesSubtotal,
    durationMultiplier,
    rentalSubtotal: Math.round(rentalSubtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    appliedDiscountName,
    shippingCost,
    depositAmount,
    subtotalExVat: Math.round(subtotalExVat * 100) / 100,
    vatAmount,
    totalIncVat,
    pricePerPerson,
  };
}
