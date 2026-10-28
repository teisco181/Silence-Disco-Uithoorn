import React from 'react';
import { useRental } from '../context/RentalContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useRental();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className="bg-slate-900 border border-emerald-500/50 shadow-2xl shadow-emerald-500/20 text-white px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-semibold">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
