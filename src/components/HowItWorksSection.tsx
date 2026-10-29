import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import {
  Package,
  Radio,
  Music,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Smartphone,
  Sliders,
} from 'lucide-react';
import equipmentCaseImg from '../assets/images/silent_disco_equipment_case_1793196647576.jpg';

export const HowItWorksSection: React.FC = () => {
  const { setActiveTab } = useRental();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      number: '01',
      title: 'Kies Je Set & Bestel Online',
      description:
        'Kies eenvoudig het aantal koptelefoons en zenders via onze calculator. We sturen de set 1 tot 2 dagen vóór je feestdatum op via PostNL in een robuuste transportkoffer, of je haalt hem gratis op.',
      icon: <Package className="w-5 h-5 text-cyan-400" />,
    },
    {
      number: '02',
      title: 'Plug & Play Binnen 2 Minuten',
      description:
        'Stop de stekker van de zender in het stopcontact (of sluit een powerbank aan). Sluit je smartphone, tablet, laptop of DJ set aan met de meegeleverde gratis kabels. Zet Spotify of je DJ mix aan en het geluid knalt direct kraakhelder door de zaal!',
      icon: <Radio className="w-5 h-5 text-pink-400" />,
    },
    {
      number: '03',
      title: 'Switch Tussen 3 Muziekstromen',
      description:
        'Iedere danser kan op zijn eigen koptelefoon schakelen tussen Kanaal 1 (Rood), Kanaal 2 (Blauw) en Kanaal 3 (Groen). De felle LED verlichting verraadt meteen wie op welke DJ danst!',
      icon: <Music className="w-5 h-5 text-emerald-400" />,
    },
    {
      number: '04',
      title: 'Gratis Retour via PostNL',
      description:
        'Na afloop pak je alles weer in de koffer. Plak het meegeleverde voorgedrukte PostNL retourlabel erop en geef hem op maandag af bij een willekeurig PostNL punt. Na controle storten wij de borg direct retour.',
      icon: <Truck className="w-5 h-5 text-amber-400" />,
    },
  ];

  const faqs = [
    {
      q: 'Hoe lang gaat de accu van de koptelefoons mee?',
      a: 'Onze professionele Silent Disco koptelefoons hebben een krachtige ingebouwde lithium-ion batterij die maar liefst 10 tot 12 uur non-stop muziek garandeert op vol volume. We leveren alle sets altijd 100% volledig opgeladen aan!',
    },
    {
      q: 'Wat is het bereik van de draadloze zenders?',
      a: 'Onze zenders zenden uit op de storingsvrije 863-865 MHz UHF-band en hebben een krachtig zendbereik van minimaal 450 tot 500 meter, zelfs door muren en over meerdere verdiepingen heen.',
    },
    {
      q: 'Hoe sluit ik Spotify of mijn telefoon aan?',
      a: 'Heel makkelijk! In elke set leveren we alle denkbare verloopkabels mee: Apple Lightning, Android USB-C, standaard 3.5mm koptelefoon mini-jack en rode/witte tulp (RCA) kabels voor DJ controllers.',
    },
    {
      q: 'Wanneer ontvang ik de set en wanneer stuur ik hem terug?',
      a: 'Je ontvangt de set minimaal 1 werkdag voor je evenement. Heb je een zaterdagfeest? Dan heb je hem uiterlijk donderdag of vrijdag in huis. Je stuurt het pakket pas de eerstvolgende werkdag (maandag) weer retour. Voor die extra dagen betaal je bij onze weekendactie niets extra!',
    },
    {
      q: 'Hoe zit het met de borg en retourbetaling?',
      a: 'Wij hanteren een standaard borg van €50,- per bestelling. Zodra de set compleet en onbeschadigd bij ons binnen is gekomen en gecontroleerd, storten we de borg binnen 2 werkdagen direct terug op je rekening.',
    },
  ];

  return (
    <div className="py-14 sm:py-20 bg-slate-950 text-slate-100 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-3 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zo Eenvoudig Werkt Het</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight mb-4">
            Silent Disco in 4 Simpele Stappen
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Geen ingewikkelde techniek of kabelsalade. Binnen 2 minuten speelt jouw favoriete playlist over al je koptelefoons.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-6 bg-slate-900/80 rounded-3xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-extrabold text-cyan-400/40">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white font-display mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Geen technische kennis vereist</span>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Equipment Case Showcase */}
        <div className="mb-20 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-6 p-8 sm:p-12">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
                Professionele Flightcase & Apparatuur
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-4">
                Altijd netjes & veilig verpakt in stevige transportbox
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Elke set wordt geleverd in een schokbestendige koffer voorzien van voorgevormd schuim. Zo blijven de koptelefoons en zenders optimaal beschermd tijdens transport en houd je het feestterrein georganiseerd.
              </p>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Kanaalkleuren: Rood (Ch 1), Blauw (Ch 2) & Groen (Ch 3)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Verstelbare hoofdband & comfortabele over-ear oorkussens</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                  <span>Onafhankelijke volumeknop op elke individuele koptelefoon</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:from-cyan-300 hover:to-emerald-300 transition-all cursor-pointer"
                >
                  Configureer Jouw Set Nu
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 h-72 lg:h-[420px] relative">
              <img
                src={equipmentCaseImg}
                alt="Silent Disco flightcase met koptelefoons en zenders"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
              Veelgestelde Vragen
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Alles wat je moet weten over het huren, aansluiten en retourneren
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
