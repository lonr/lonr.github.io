export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const DAY_TAB = [
  [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
] as const;

export function startOfDay(date: Date, local = true) {
  date = new Date(date);
  local ? date.setHours(0, 0, 0, 0) : date.setUTCHours(0, 0, 0, 0);
  return date;
}

export function endOfDay(date: Date, local = true) {
  date = new Date(date);
  local ? date.setHours(23, 59, 59, 999) : date.setUTCHours(23, 59, 59, 999);
  return date;
}

export function sundayWeeksAgo(date: Date, weeks: number, local = true) {
  // avoid mutating date outside
  date = new Date(date);
  local
    ? date.setDate(date.getDate() - date.getDay() - 7 * weeks)
    : date.setUTCDate(date.getUTCDate() - date.getUTCDay() - 7 * weeks);
  return date;
}

export function sundayThisWeek(date: Date, local = true) {
  return sundayWeeksAgo(date, 0, local);
}

export function saturdayThisWeek(date: Date, local = true) {
  date = new Date(date);
  local
    ? date.setDate(date.getDate() - date.getDay() + 6)
    : date.setUTCDate(date.getUTCDate() - date.getUTCDay() + 6);
  return date;
}

export interface DateObj {
  year: number;
  month: number;
  date: number;
}

export function dateToDateObj(date: Date, local = true) {
  return {
    year: local ? date.getFullYear() : date.getUTCFullYear(),
    month: local ? date.getMonth() + 1 : date.getUTCMonth() + 1,
    date: local ? date.getDate() : date.getUTCDate(),
  };
}

function pad(num: number, length = 2): string {
  // return `0${num}`.slice(-2);
  return num.toString().padStart(length, '0');
}

export function dateObjToString(obj: DateObj) {
  return `${obj.year}-${pad(obj.month)}-${pad(obj.date)}`;
}

export function stringToDateObj(str: string): DateObj {
  const [year, month, date] = str.split('').map((str) => +str);
  return { year, month, date };
}

export function compareDateObj(obj1: DateObj, obj2: DateObj) {
  let diff =
    obj1.year * 10000 +
    obj1.month * 100 +
    obj1.date -
    (obj2.year * 10000 + obj2.month * 100 + obj2.date);
  return diff < 0 ? -1 : diff > 0 ? 1 : 0;
}

export function getNextDay(today: DateObj): DateObj {
  const { year, month, date } = today;
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const nextDay: DateObj = { ...today };

  if (date < DAY_TAB[+leap][month - 1]) {
    nextDay.date += 1;
  } else if (month < 12) {
    nextDay.date = 1;
    nextDay.month += 1;
  } else {
    nextDay.date = 1;
    nextDay.month = 1;
    nextDay.year += 1;
  }

  return nextDay;
}

export function compareDateISOString(a: string, b: string): number {
  return Date.parse(a) - Date.parse(b);
}

export function inSameDay(a: Date, b: Date, local = true) {
  if (local) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  } else {
    return (
      a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() === b.getUTCMonth() &&
      a.getUTCDate() === b.getUTCDate()
    );
  }
}

// local 2021-01-01 to Date
export function parseLocalYMD(ymd: string) {
  const args = ymd.split('-').map((str) => +str) as [number, number, number];
  args[1] = args[1] - 1;
  return new Date(...args);
}

export function toLocalYMD(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
