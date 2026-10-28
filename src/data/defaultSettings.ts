import { RentalSettings, DealOffer } from '../types/rental';

export const DEFAULT_RENTAL_SETTINGS: RentalSettings = {
  totalStockHeadphones: 350,
  minHeadphones: 10,
  basePricePerHeadphone: 3.50,
  tierPricing: [
    { minCount: 1, maxCount: 24, pricePerHeadphone: 3.50, label: '1 - 24 stuks' },
    { minCount: 25, maxCount: 49, pricePerHeadphone: 3.00, label: '25 - 49 stuks' },
    { minCount: 50, maxCount: 99, pricePerHeadphone: 2.60, label: '50 - 99 stuks' },
    { minCount: 100, maxCount: null, pricePerHeadphone: 2.10, label: '100+ stuks' },
  ],
  pricePerTransmitter: 15.00,
  pricePerDiscoLight: 12.50,
  pricePowerbank: 7.50,
  shippingCostRoundtrip: 14.95,
  defaultDeposit: 50.00,
  weekendSurchargeMultiplier: 1.0, // Weekend gratis verlengd als actie!
  vatPercentage: 21,
};

export const DEFAULT_OFFERS: DealOffer[] = [
  {
    id: 'weekend-warrior',
    title: 'Weekend Huur Actie: 3 Dagen voor 1 Dag Prijs',
    badge: 'Meest Populair',
    tagline: 'Vrijdag in huis, zaterdag feesten, maandag gratis retour!',
    headphonesCount: 25,
    transmittersCount: 2,
    discoLightsCount: 1,
    powerbanksCount: 0,
    includeDJCables: true,
    rentalDurationDays: 3,
    isWeekendDeal: true,
    fixedPrice: 99.00,
    originalPrice: 135.00,
    description: 'De ultieme formule voor elk weekendfeest. Je ontvangt de set al op donderdag of vrijdag via PostNL en retourneert pas op maandag. Géén meerkosten voor de extra dagen.',
    features: [
      '25 Silent Disco LED-koptelefoons (3 kanalen)',
      '2 Krachtige zenders met bereik tot 500 meter',
      '1 Roterende RGB Party Discolamp t.w.v. €12,50 gratis',
      'Complete kabelset (iPhone Lightning, USB-C & mini-jack)',
      'Gratis retourlabel voor PostNL servicepunt'
    ],
    active: true,
    popular: true,
  },
  {
    id: 'huisfeest-compact',
    title: 'Huisfeest & Verjaardag Bundel',
    badge: 'Ideaal voor Thuis',
    tagline: 'Alles wat je nodig hebt voor een knallende verjaardag zonder geluidsoverlast.',
    headphonesCount: 15,
    transmittersCount: 2,
    discoLightsCount: 1,
    powerbanksCount: 0,
    includeDJCables: true,
    rentalDurationDays: 1,
    isWeekendDeal: false,
    fixedPrice: 69.00,
    originalPrice: 89.00,
    description: 'Perfect voor een compacte huiskamer of tuinfeest. Switch moeiteloos tussen 2 muziekstromen (bijv. 90s vs Techno) zonder burenklachten.',
    features: [
      '15 Opvouwbare RGB LED-koptelefoons',
      '2 Zenders (Rood en Blauw kanaal)',
      '1 RGB Disco lichteffect',
      'Plug & Play aansluiting op Spotify of laptop',
      'Stevige transportbox'
    ],
    active: true,
    popular: false,
  },
  {
    id: 'festival-rave-xxl',
    title: 'Festival & Vereniging XXL Bundel',
    badge: 'Groot Volume Voordeel',
    tagline: 'Voor studentenverenigingen, sportclubs, dorpsfeesten & bruiloften.',
    headphonesCount: 75,
    transmittersCount: 3,
    discoLightsCount: 2,
    powerbanksCount: 2,
    includeDJCables: true,
    rentalDurationDays: 1,
    isWeekendDeal: false,
    fixedPrice: 229.00,
    originalPrice: 310.00,
    description: 'Complete festival ervaring met alle 3 kanalen (Rood, Blauw & Groen) bezet door verschillende DJ’s. Inclusief accupacks voor mobiel of buitengebruik.',
    features: [
      '75 Silent Disco hoofdtelefoons met kanaalkleur LED',
      '3 Zenders voor maximale DJ battles',
      '2 Krachtige Powerbanks (handig in het park of bos)',
      '2 Dynamische LED Party spots',
      'Professionele flightcases op wieltjes'
    ],
    active: true,
    popular: false,
  },
  {
    id: 'studenten-korting',
    title: 'Studenten & Introductie Pakket',
    badge: 'Studenten Deal',
    tagline: 'Extra voordelig tarief voor studieverenigingen en studentenhuizen.',
    headphonesCount: 40,
    transmittersCount: 2,
    discoLightsCount: 1,
    powerbanksCount: 0,
    includeDJCables: true,
    rentalDurationDays: 1,
    isWeekendDeal: false,
    fixedPrice: 129.00,
    originalPrice: 165.00,
    description: 'Geef een legendarisch huisfeest in de studentenstad zonder risico op politiebezoek of boetes voor geluidsoverlast.',
    features: [
      '40 Koptelefoons met superheldere bastonen',
      '2 Zenders met extra lange accuduur',
      '1 Party Discolamp',
      'Gratis bezorging en retour in heel Nederland & Vlaanderen',
      'Reservekoptelefoon inbegrepen'
    ],
    active: true,
    popular: false,
  }
];

export const VALID_PROMO_CODES: Record<string, { discountPercent?: number; discountEuro?: number; label: string }> = {
  'SILENT10': { discountPercent: 10, label: '10% Welkomstkorting' },
  'STUDENT2026': { discountEuro: 15, label: '€15,- Studentenbonus' },
  'DISCOFEEST': { discountPercent: 15, label: '15% Feestkorting' },
};
