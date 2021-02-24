import { BlogList } from '../../blogs/blogs';

export interface YearFilter {
  year: number;
  routerLink: string;
  queryParams: {
    start: string;
    end: string;
  };
}

export function getYearFilters(blogList: BlogList): YearFilter[] {
  const earliestYear = +blogList[blogList.length - 1].created_at.slice(0, 4);
  const thisYear = new Date().getFullYear();
  return [...Array(thisYear - earliestYear + 1)].map((_, index) => {
    const year = earliestYear + index;
    return {
      year,
      routerLink: './',
      queryParams: { start: `${year}-01-01`, end: `${year}-12-31` },
    };
  });
}
