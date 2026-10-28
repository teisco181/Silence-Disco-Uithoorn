import React from 'react';
import { RentalProvider, useRental } from './context/RentalContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CalculatorSection } from './components/CalculatorSection';
import { OffersSection } from './components/OffersSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AdminPanel } from './components/AdminPanel';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { activeTab } = useRental();

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
