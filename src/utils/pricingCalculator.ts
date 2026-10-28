import { RentalCart, RentalSettings, DealOffer, PricingCalculation } from '../types/rental';
import { VALID_PROMO_CODES } from '../data/defaultSettings';

export function calculatePricing(
  cart: RentalCart,
  settings: RentalSettings,
  offers: DealOffer[]
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
  const transmittersSubtotal = cart.transmittersCount * settings.pricePerTransmitter;
  const discoLightsSubtotal = cart.discoLightsCount * settings.pricePerDiscoLight;
  const powerbanksSubtotal = cart.powerbanksCount * settings.pricePowerbank;
  const cablesSubtotal = 0; // standard included with transmitters

  // Duration multiplier:
  // 1 day = 1x
  // 2 days = 1.6x
  // 3+ days: if weekend deal, 1x or settings.weekendSurchargeMultiplier
  let durationMultiplier = 1;
  if (cart.rentalDays === 2) {
    durationMultiplier = 1.6;
  } else if (cart.rentalDays >= 3) {
    if (cart.isWeekend) {
      durationMultiplier = settings.weekendSurchargeMultiplier;
    } else {
      durationMultiplier = 1 + (cart.rentalDays - 1) * 0.5;
    }
  }

  let rentalSubtotal =
    (headphonesSubtotal + transmittersSubtotal + discoLightsSubtotal + powerbanksSubtotal + cablesSubtotal) *
    durationMultiplier;

  let discountAmount = 0;
  let appliedDiscountName = undefined;

  if (appliedOffer) {
    // If it's a fixed package price offer
    const theoreticalRegularPrice = rentalSubtotal;
    if (appliedOffer.fixedPrice < theoreticalRegularPrice) {
      discountAmount = Math.max(0, theoreticalRegularPrice - appliedOffer.fixedPrice);
      appliedDiscountName = `Aanbieding: ${appliedOffer.title}`;
    }
  }

  // Promo code discount
  const cleanCode = cart.promoCode.trim().toUpperCase();
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

  const shippingCost = cart.deliveryType === 'delivery' ? settings.shippingCostRoundtrip : 0;
  const depositAmount = settings.defaultDeposit;

  const subtotalExVat = Math.max(0, rentalSubtotal - discountAmount);
  // VAT is included in standard Dutch retail consumer prices, so we display the 21% portion:
  const vatRate = settings.vatPercentage / 100;
  // If price is incl VAT:
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
    discoLightsSubtotal,
    powerbanksSubtotal,
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
