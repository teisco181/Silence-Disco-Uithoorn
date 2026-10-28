import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { getAvailabilityForDate, formatDutchDate } from '../utils/availability';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

interface AvailabilityCalendarProps {
  compact?: boolean;
  onDateSelected?: (startDate: string, eventDate: string, returnDate: string) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  compact = false,
  onDateSelected,
}) => {
  const { cart, setDates, bookings, settings, openBookingModal } = useRental();

  // Selected view month
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date(cart.startDate || Date.now());
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get calendar matrix
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun
  // Convert to Monday-first (0 = Mon, 6 = Sun)
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const monthNames = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
  ];

  const dayHeaders = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  const handleDayClick = (day: number) => {
    // Determine start (Friday before or the day itself), event, and return
    const clickedDate = new Date(year, month, day);
    const dayOfWeek = clickedDate.getDay(); // 0 is Sun, 5 is Fri, 6 is Sat

    let start = new Date(clickedDate);
    let event = new Date(clickedDate);
    let ret = new Date(clickedDate);
    let isWeekend = false;

    if (dayOfWeek === 6 || dayOfWeek === 5) {
      // It's a weekend party
      isWeekend = true;
      if (dayOfWeek === 6) { // Saturday
        start.setDate(clickedDate.getDate() - 1); // Friday arrival
        event = clickedDate;
        ret.setDate(clickedDate.getDate() + 2); // Monday return
      } else { // Friday
        start = clickedDate;
        event.setDate(clickedDate.getDate() + 1); // Saturday party
        ret.setDate(clickedDate.getDate() + 3); // Monday return
      }
    } else {
      // Single day / mid-week event
      isWeekend = false;
      start.setDate(clickedDate.getDate() - 1);
      event = clickedDate;
      ret.setDate(clickedDate.getDate() + 1);
    }

    const startStr = start.toISOString().split('T')[0];
    const eventStr = event.toISOString().split('T')[0];
    const retStr = ret.toISOString().split('T')[0];

    setDates(startStr, eventStr, retStr, isWeekend);
    if (onDateSelected) {
      onDateSelected(startStr, eventStr, retStr);
    }
  };

  // Quick Weekend Preset buttons
  const selectQuickWeekend = (weeksAhead: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextFri = ((5 - dayOfWeek + 7) % 7 || 7) + weeksAhead * 7;
    
    const fri = new Date(today);
    fri.setDate(today.getDate() + daysUntilNextFri);
    const sat = new Date(fri);
    sat.setDate(fri.getDate() + 1);
    const mon = new Date(fri);
    mon.setDate(fri.getDate() + 3);

    const startStr = fri.toISOString().split('T')[0];
    const eventStr = sat.toISOString().split('T')[0];
    const retStr = mon.toISOString().split('T')[0];

    setCurrentDate(new Date(fri.getFullYear(), fri.getMonth(), 1));
    setDates(startStr, eventStr, retStr, true);
    if (onDateSelected) {
      onDateSelected(startStr, eventStr, retStr);
    }
  };

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden ${compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'}`}>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Beschikbaarheidskalender</span>
          </div>
          <h3 className={`${compact ? 'text-lg' : 'text-xl sm:text-2xl'} font-bold text-white font-display`}>
            Selecteer Je Feestdatum & Check Beschikbaarheid
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime inzicht in beschikbare voorraad ({settings.totalStockHeadphones} koptelefoons totaal).
          </p>
        </div>

        {/* Month selector navigation */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Vorige maand"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-white text-sm sm:text-base font-display min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Volgende maand"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Weekend Selectors */}
      <div className="py-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Snel kiezen:</span>
        <button
          type="button"
          onClick={() => selectQuickWeekend(0)}
          className="px-2.5 py-1 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 rounded-lg hover:bg-cyan-900/60 transition-colors cursor-pointer"
        >
          Aankomend weekend
        </button>
        <button
          type="button"
          onClick={() => selectQuickWeekend(1)}
          className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Volgend weekend
        </button>
        <button
          type="button"
          onClick={() => selectQuickWeekend(2)}
          className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Over 2 weken
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mt-2">
        {/* Day name headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 pb-2">
          {dayHeaders.map((dh) => (
            <div key={dh} className="py-1">
              {dh}
            </div>
          ))}
        </div>

        {/* Days matrix */}
        <div className="grid grid-cols-7 gap-1.5">
          {daysArray.map((dayNum, idx) => {
            if (dayNum === null) {
              return <div key={`empty-${idx}`} className="h-14 sm:h-16 rounded-xl bg-transparent" />;
            }

            const currentDayDate = new Date(year, month, dayNum);
            const dateStr = currentDayDate.toISOString().split('T')[0];
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            const avail = getAvailabilityForDate(dateStr, bookings, settings.totalStockHeadphones);

            // Is within selected cart range?
            const isSelected = dateStr >= cart.startDate && dateStr <= cart.returnDate;
            const isEventDay = dateStr === cart.eventDate;

            // Is date in the past?
            const isPast = currentDayDate < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast || avail.status === 'sold_out'}
                onClick={() => handleDayClick(dayNum)}
                className={`relative h-14 sm:h-16 p-1 sm:p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isPast
                    ? 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'bg-cyan-950/90 border-cyan-400 shadow-md shadow-cyan-500/20 text-white ring-1 ring-cyan-400'
                    : avail.status === 'sold_out'
                    ? 'bg-rose-950/20 border-rose-900/40 text-slate-500 cursor-not-allowed'
                    : avail.status === 'low'
                    ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-500 text-slate-200'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold font-mono ${
                      isSelected
                        ? 'text-cyan-300'
                        : isToday
                        ? 'text-amber-400 underline underline-offset-2'
                        : 'text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isEventDay && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400" title="Gekozen Feestdag" />
                  )}
                </div>

                {/* Stock capacity badge */}
                {!isPast && (
                  <div className="w-full text-right">
                    {avail.status === 'sold_out' ? (
                      <span className="text-[9px] text-rose-400 font-semibold block">Vol</span>
                    ) : (
                      <span
                        className={`text-[9px] font-mono tabular-nums block ${
                          isSelected
                            ? 'text-cyan-200 font-bold'
                            : avail.status === 'low'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {avail.availableCount} vrij
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend & Current Selection Summary */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Ruim beschikbaar (&gt;100 vrij)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Beperkt beschikbaar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Volgeboekt</span>
          </div>
        </div>

        {/* Selected Date range display */}
        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <div className="text-[11px] text-slate-400">Geselecteerde huurperiode:</div>
            <div className="text-xs font-bold text-white">
              {formatDutchDate(cart.startDate, false)} t/m {formatDutchDate(cart.returnDate, false)}
            </div>
          </div>

          <button
            type="button"
            onClick={openBookingModal}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:from-cyan-300 hover:to-emerald-300 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Boek Deze Periode</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
