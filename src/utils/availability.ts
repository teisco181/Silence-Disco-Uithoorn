import { BookingRecord, DayAvailability } from '../types/rental';

/**
 * Checks if a specific target date falls within a booking's rental range [startDate, returnDate]
 */
export function isDateWithinBooking(targetDate: string, booking: BookingRecord): boolean {
  if (booking.paymentStatus === 'cancelled') return false;
  return targetDate >= booking.startDate && targetDate <= booking.returnDate;
}

/**
 * Returns availability statistics for a single date
 */
export function getAvailabilityForDate(
  dateStr: string,
  bookings: BookingRecord[],
  totalStock: number
): DayAvailability {
  let bookedCount = 0;

  for (const b of bookings) {
    if (isDateWithinBooking(dateStr, b)) {
      bookedCount += b.cart.headphonesCount;
    }
  }

  const availableCount = Math.max(0, totalStock - bookedCount);
  let status: 'available' | 'low' | 'sold_out' = 'available';

  if (availableCount === 0) {
    status = 'sold_out';
  } else if (availableCount <= totalStock * 0.3) {
    status = 'low';
  }

  return {
    date: dateStr,
    bookedCount,
    availableCount,
    totalStock,
    status,
  };
}

/**
 * Checks if a requested quantity is available for an entire date span
 */
export function checkRangeAvailability(
  startDate: string,
  returnDate: string,
  requestedHeadphones: number,
  bookings: BookingRecord[],
  totalStock: number
): {
  isAvailable: boolean;
  minAvailable: number;
  bottleneckDate?: string;
  bottleneckBooked?: number;
} {
  if (!startDate || !returnDate) {
    return { isAvailable: true, minAvailable: totalStock };
  }

  let current = new Date(startDate);
  const end = new Date(returnDate);
  let minAvailable = totalStock;
  let bottleneckDate: string | undefined = undefined;
  let bottleneckBooked: number | undefined = undefined;

  // iterate day by day
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const dayStat = getAvailabilityForDate(dateStr, bookings, totalStock);

    if (dayStat.availableCount < minAvailable) {
      minAvailable = dayStat.availableCount;
      bottleneckDate = dateStr;
      bottleneckBooked = dayStat.bookedCount;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    isAvailable: requestedHeadphones <= minAvailable,
    minAvailable,
    bottleneckDate,
    bottleneckBooked,
  };
}

/**
 * Generate a list of dates for a month view
 */
export function getMonthDays(year: number, monthIndex: number): string[] {
  const days: string[] = [];
  const date = new Date(year, monthIndex, 1);
  while (date.getMonth() === monthIndex) {
    days.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() + 1);
  }
  return days;
}

/**
 * Helper to format Dutch date strings nicely (e.g. "Vrijdag 6 november 2026")
 */
export function formatDutchDate(dateStr: string, includeDayName = true): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  if (includeDayName) {
    options.weekday = 'long';
  }

  return d.toLocaleDateString('nl-NL', options);
}
