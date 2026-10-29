import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import {
  Package,
  Radio,
  Music,
  MapPin,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Sliders,
} from 'lucide-react';
import equipmentCaseImg from '../assets/images/silent_disco_equipment_case_1793196647576.jpg';

export const HowItWorksSection: React.FC = () => {
  const { setActiveTab } = useRental();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      number: '01',
      title: 'Kies Je Set & Reserveer Online',
      description:
        'Kies via de calculator het aantal koptelefoons en zenders voor jouw feest. Je ziet direct live de beschikbaarheid en de vaste afhaallocatie in Uithoorn.',
      icon: <Sliders className="w-5 h-5 text-cyan-400" />,
    },
    {
      number: '02',
      title: 'Zelf Ophalen in Uithoorn',
      description:
        'Haal de set op het afgesproken moment op aan de Wiegerbruinlaan in Uithoorn. Alles zit kant-en-klaar en 100% opgeladen in een stevige transportbox.',
      icon: <MapPin className="w-5 h-5 text-pink-400" />,
    },
    {
      number: '03',
      title: 'Plug & Play Binnen 2 Minuten',
      description:
        'Stop de zender in het stopcontact en sluit je smartphone (Spotify) of DJ-set aan met de meegeleverde gratis kabels. Gasten switchen direct tussen de 3 verlichte kanalen!',
      icon: <Music className="w-5 h-5 text-emerald-400" />,
    },
    {
      number: '04',
      title: 'Ontspannen Terugbrengen in Uithoorn',
      description:
        'Na afloop lever je de koffer weer in op onze locatie in Uithoorn. Bij het weekendtarief haal je vrijdag op en breng je pas maandag terug. Je borg wordt direct verrekend!',
      icon: <RotateCcw className="w-5 h-5 text-amber-400" />,
    },
  ];

  const faqs = [
    {
      q: 'Waar en wanneer kan ik de silent disco set ophalen?',
      a: 'Je haalt de set op aan de Wiegerbruinlaan 12 in Uithoorn. Bij een weekendfeest kun je de koffer al op vrijdagmiddag ophalen en hoef je hem pas op maandag in te leveren. Doordeweeks stemmen we het afhaal- en inlevermoment in goed overleg af.',
    },
    {
      q: 'Versturen jullie ook via PostNL of koerier?',
      a: 'Nee, wij richten ons exclusief op Uithoorn en directe omstreken (zoals De Kwakel, Aalsmeer, Amstelveen en Mijdrecht). Hierdoor betaal je géén verzendkosten, heb je geen last van postvertragingen en weet je 100% zeker dat je set op tijd klaarstaat.',
    },
    {
      q: 'Hoe lang gaat de accu van de koptelefoons mee?',
      a: 'Onze professionele Silent Disco koptelefoons hebben een krachtige ingebouwde batterij die 10 tot 12 uur non-stop muziek garandeert op vol volume. We leveren alle koptelefoons altijd volledig opgeladen aan!',
    },
    {
      q: 'Hoe sluit ik Spotify of mijn telefoon aan?',
      a: 'Heel eenvoudig! In elke set leveren we alle benodigde kabels gratis mee: Apple Lightning, Android USB-C, 3.5mm koptelefoon mini-jack en tulp (RCA) kabels voor DJ controllers en mixers.',
    },
    {
      q: 'Hoe zit het met de borg en retourbetaling?',
      a: 'We hanteren een standaard borg van €50,- per reservering. Zodra je de set compleet weer inlevert in Uithoorn, wordt de borg direct teruggemeld en op je rekening teruggestort.',
    },
  ];

  return (
    <div className="py-14 sm:py-20 bg-slate-950 text-slate-100 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-3 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Regio Uithoorn & Omstreken</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight mb-4">
            Silent Disco in 4 Simpele Stappen
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Geen ingewikkelde techniek of verzendgedoe. Zelf ophalen in Uithoorn, inpluggen en feesten tot in de vroege uurtjes zónder burenoverlast.
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
                <span>Geen verzendkosten · Direct klaar</span>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Equipment Case Showcase */}
        <div className="mb-20 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-6 p-8 sm:p-12">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
                Professionele Box & Apparatuur
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-4">
                Altijd veilig verpakt in stevige transportbox
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Elke set wordt overhandigd in een nette, beschermende transportbox met handvat. Zo neem je de set gemakkelijk mee in de auto of op de fiets in Uithoorn en houd je alle apparatuur overzichtelijk bij elkaar.
              </p>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Kanaalkleuren: Rood (Ch 1), Blauw (Ch 2) & Groen (Ch 3)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Verstelbare hoofdband & zachte over-ear oorkussens</span>
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
                  Stel Jouw Set Samen
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 h-72 lg:h-[420px] relative">
              <img
                src={equipmentCaseImg}
                alt="Silent Disco koffer met koptelefoons en zenders"
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
              Alles over ophalen in Uithoorn, aansluiten en borg
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
