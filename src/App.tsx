import React from 'react';
import { RentalProvider, useRental } from './context/RentalContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CalculatorSection } from './components/CalculatorSection';
import { OffersSection } from './components/OffersSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { AdminPanel } from './components/AdminPanel';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, openBookingModal, cart } = useRental();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <CalculatorSection />
          </>
        )}

        {activeTab === 'beschikbaarheid' && (
          <div className="py-12 sm:py-16 bg-slate-950 text-slate-100 min-h-[calc(100vh-80px)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-2">
                  Realtime Voorraad & Kalender
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                  Beschikbaarheid Silent Disco Sets
                </h1>
                <p className="text-sm text-slate-400 mt-2">
                  Bekijk direct op welke dagen en weekenden er nog voldoende koptelefoons beschikbaar zijn. Klik op een datum om direct te reserveren!
                </p>
              </div>

              <AvailabilityCalendar />

              {/* Extra reassurance banner */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base">
                    Grote groep of festival met 100+ koptelefoons?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Wij adviseren om minimaal 2 tot 3 weken van tevoren te reserveren.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Set Samenstellen
                  </button>
                  <button
                    onClick={openBookingModal}
                    className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl transition-all cursor-pointer"
                  >
                    Direct Reserveren
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'aanbiedingen' && <OffersSection />}

        {activeTab === 'hoe-werkt-het' && <HowItWorksSection />}

        {activeTab === 'beheer' && <AdminPanel />}
      </main>

      <Footer />
      <BookingModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <RentalProvider>
      <AppContent />
    </RentalProvider>
  );
}
