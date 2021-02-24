import {
  compareDateObj,
  dateToDateObj,
  DateObj,
  dateObjToString,
  getNextDay,
  MONTHS,
  saturdayThisWeek,
  sundayThisWeek,
  sundayWeeksAgo,
  WEEKDAYS,
} from 'src/utils/date';
import { BlogsGroupedByDate } from '../../blogs/blogs';

// prettier-ignore
const DOT_MAP = [
  [  ,  ,  ,  ,  ,  ,   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 0,  ,  ,  , 0,  ,  ,  , 0,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
  [  ,  ,  ,  ,  ,  ,   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 0,  ,  ,  , 0,  ,  ,  ,  ,  ,  ,  , 9, 9,  , 9, 9,  ,  ,  ],
  [  ,  ,  ,  , 1,  ,   ,  ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  , 0,  ,  ,  , 0,  , 0, 0,  ,  , 0, 0, 0,  ,  , 0, 0, 0,  ,  ,  ,  , 9, 9, 9, 9, 9, 9, 9,  ,  ],
  [  ,  ,  , 1,  ,  ,   ,  ,  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ,  , 0,  , 0,  , 0,  ,  , 0,  ,  ,  , 0,  ,  ,  , 0,  ,  , 0,  ,  ,  , 9, 9, 9, 9, 9, 9, 9,  ,  ],
  [  ,  , 1,  ,  ,  ,   ,  ,  , 1,  ,  ,  ,  ,  ,  , 1,  ,  ,  , 0,  , 0,  , 0,  ,  , 0,  ,  ,  , 0,  ,  ,  , 0,  ,  , 0,  ,  ,  ,  , 9, 9, 9, 9, 9,  ,  ,  ],
  [  ,  ,  , 1,  ,  ,   ,  , 1,  ,  ,  ,  ,  ,  , 1,  ,  ,  ,  , 0,  , 0,  , 0,  ,  , 0,  ,  ,  , 0,  ,  ,  , 0,  ,  , 0,  ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ],
  [  ,  ,  ,  , 1,  ,   , 1,  ,  ,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 0,  , 0,  ,  , 0, 0, 0,  ,  ,  , 0, 0,  , 0,  ,  , 0,  ,  ,  ,  ,  ,  , 9,  ,  ,  ,  ,  ]
];

export interface CalData {
  calWeeks: CalWeek[];
  monthLabels: MonthLabel[];
  weekdayLabels: WeekdayLabel[];
  legendColors: string[];
}

interface CalDay {
  x: number;
  y: number;
  fill: string;
  'data-date': string;
  'data-count': number;
}

interface CalWeek {
  calDays: CalDay[];
  transform: string;
}

interface MonthLabel {
  name: string;
  x: number;
}

interface WeekdayLabel {
  name: string;
  dy: number;
}

interface DataProvider {
  (weekIndex: number, dayIndex: number, data: DateObj): Partial<CalDay>;
}

export function getGraffitiCalData() {
  const firstSunday = sundayWeeksAgo(new Date(), 52);
  const lastSaturday = saturdayThisWeek(new Date());
  return genCalData(firstSunday, lastSaturday, (weekIndex, dayIndex) => {
    switch (DOT_MAP[dayIndex][weekIndex]) {
      case 1:
        return { fill: '#0a659e' };
      case 0:
        return { fill: '#f59a61' };
      case 9:
        return { fill: '#e51a4c' };
      default:
        return {};
    }
  });
}

const HalloweenColors = ['#ffee4a', '#ffc501', '#fe9600', '#03001c'];

function chooseFillFromBlogCount(count: number): string {
  let fill = '';
  if (count <= 4) {
    fill = HalloweenColors[count - 1];
  } else {
    fill = HalloweenColors[3];
  }
  return fill;
}

export function getCalData(
  groupedBlogs: BlogsGroupedByDate,
  start: Date = sundayWeeksAgo(new Date(), 52),
  end: Date = new Date(),
) {
  return genCalData(start, end, (weekIndex, dayIndex, date) => {
    const blogs = groupedBlogs.get(dateObjToString(date));
    if (blogs && blogs.length > 0) {
      return {
        'data-count': blogs.length,
        fill: chooseFillFromBlogCount(blogs.length),
      };
    } else {
      return {};
    }
  });
}

function genCalData(start: Date, end: Date, dataProvider: DataProvider): CalData {
  const calWeeks: CalWeek[] = [];
  const monthLabels: MonthLabel[] = [];
  let weekdayLabels: WeekdayLabel[] = [];

  let startDateObj = dateToDateObj(start);
  let endDateObj = dateToDateObj(end);
  let dateObj = dateToDateObj(sundayThisWeek(start));

  for (let week = 0; week < 53; week += 1) {
    const calDays: CalDay[] = [];
    for (let day = 0; day < 7; day += 1) {
      if (week === 0 && compareDateObj(dateObj, startDateObj) < 0) {
        dateObj = getNextDay(dateObj);
        continue;
      }
      if (week === 52 && compareDateObj(dateObj, endDateObj) > 0) {
        break;
      }

      if (day === 0) {
        const date = dateObj.date;
        // 18 = 31 - 7 * 2 + 1
        if ((week === 0 && date <= 18) || date <= 7) {
          monthLabels.push({ name: MONTHS[dateObj.month - 1].slice(0, 3), x: 13 * week + 14 });
        }
      }

      calDays.push({
        x: 14 - week,
        y: day * 13,
        fill: '#ebedf0',
        'data-date': dateObjToString(dateObj),
        'data-count': 0,
        ...dataProvider(week, day, dateObj),
      });
      dateObj = getNextDay(dateObj);
    }
    calWeeks.push({ calDays, transform: `translate(${14 * week}, 0)` });
  }

  weekdayLabels = WEEKDAYS.map((name, index) => ({
    name: name.slice(0, 3),
    dy: 8 + 13 * index,
  })).filter((res, index) => index % 2 === 1);

  return { calWeeks, monthLabels, weekdayLabels, legendColors: HalloweenColors };
}
