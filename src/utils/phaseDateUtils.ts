export interface PhaseDateInfo {
  duration: '6 Months' | '1 Year' | '2 Years';
  startDate: string;
  endDate: string;
  assignedDates: string; // e.g. "From: 01/Jul/2026 To: 31/Dec/2026"
}

export const DURATION_OPTIONS = ['6 Months', '1 Year', '2 Years'] as const;
export type DurationOption = (typeof DURATION_OPTIONS)[number];

export const COMMON_START_DATES = [
  '01/Jul/2026',
  '01/Jan/2027',
  '01/Jul/2027',
  '01/Jan/2028',
];

/**
 * Normalizes duration string to standard format
 */
export function normalizeDuration(val?: string): DurationOption {
  if (!val) return '6 Months';
  const lower = val.toLowerCase().replace(/\s+/g, '');
  if (lower.includes('2year')) return '2 Years';
  if (lower.includes('1year') || lower.includes('12month')) return '1 Year';
  if (lower.includes('6month')) return '6 Months';
  return '6 Months';
}

/**
 * Calculates start and end dates based on duration, row number, and optional custom start date
 */
export function calculatePhaseDates(
  durationInput?: string,
  rowNumber: number = 1,
  customStartDate?: string
): PhaseDateInfo {
  const duration = normalizeDuration(durationInput);

  // Default start dates based on row number if not provided
  let startDate = customStartDate;
  if (!startDate) {
    if (rowNumber === 1) startDate = '01/Jul/2026';
    else if (rowNumber === 2) startDate = '01/Jan/2027';
    else if (rowNumber === 3) startDate = '01/Jul/2026';
    else startDate = '01/Jul/2026';
  }

  // Parse start date (assumes DD/Mon/YYYY or DD/MM/YYYY)
  const parts = startDate.split(/[\/\-]/);
  const day = parts[0] || '01';
  const monthStr = parts[1] || 'Jul';
  let year = parseInt(parts[2] || '2026', 10);

  // Map month abbreviation to index
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let monthIndex = months.findIndex((m) => m.toLowerCase() === monthStr.toLowerCase());
  if (monthIndex === -1) {
    monthIndex = parseInt(monthStr, 10) - 1;
    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) monthIndex = 6; // default July
  }

  // Calculate end date
  let endMonthIndex = monthIndex;
  let endYear = year;

  if (duration === '6 Months') {
    endMonthIndex = (monthIndex + 6) % 12;
    if (monthIndex + 6 >= 12) endYear += 1;
  } else if (duration === '1 Year') {
    endYear += 1;
  } else if (duration === '2 Years') {
    endYear += 2;
  }

  // Calculate the day before the same day of the next cycle
  // For standard enterprise terms:
  // 01/Jul/2026 + 6M => 31/Dec/2026
  // 01/Jan/2027 + 6M => 30/Jun/2027
  // 01/Jul/2026 + 1Y => 30/Jun/2027
  // 01/Jan/2027 + 1Y => 31/Dec/2027
  // 01/Jul/2026 + 2Y => 30/Jun/2028
  let endDay = '30';
  const endMonthName = months[endMonthIndex === 0 ? 11 : endMonthIndex - 1];
  if (endMonthIndex === 0) endYear -= 1; // Adjust year if December of previous calculated boundary

  if (['Jan', 'Mar', 'May', 'Jul', 'Aug', 'Oct', 'Dec'].includes(endMonthName)) {
    endDay = '31';
  } else if (endMonthName === 'Feb') {
    endDay = (endYear % 4 === 0 && (endYear % 100 !== 0 || endYear % 400 === 0)) ? '29' : '28';
  } else {
    endDay = '30';
  }

  // Specific canonical date ranges for standard PDP cycles:
  let canonicalEndDate = `${endDay}/${endMonthName}/${endYear}`;

  if (startDate === '01/Jul/2026') {
    if (duration === '6 Months') canonicalEndDate = '31/Dec/2026';
    else if (duration === '1 Year') canonicalEndDate = '30/Jun/2027';
    else if (duration === '2 Years') canonicalEndDate = '30/Jun/2028';
  } else if (startDate === '01/Jan/2027') {
    if (duration === '6 Months') canonicalEndDate = '30/Jun/2027';
    else if (duration === '1 Year') canonicalEndDate = '31/Dec/2027';
    else if (duration === '2 Years') canonicalEndDate = '31/Dec/2028';
  }

  const assignedDates = `From: ${startDate} To: ${canonicalEndDate}`;

  return {
    duration,
    startDate,
    endDate: canonicalEndDate,
    assignedDates,
  };
}
