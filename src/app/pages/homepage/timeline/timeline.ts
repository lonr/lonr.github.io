import { lowerBound, upperBound } from 'src/utils/binarySearch';
import {
  dateToDateObj,
  endOfDay,
  inSameDay,
  startOfDay,
  sundayWeeksAgo,
  toLocalYMD,
} from 'src/utils/date';
import {
  BlogList,
  BlogListItem,
  BlogsGroupedByDate,
  groupBlogListByMonth,
} from '../../blogs/blogs';

interface timelineDate {

}

export function getMonthTimeline(
  blogList: BlogList,
  start: Date = sundayWeeksAgo(new Date(), 52),
  end: Date = new Date(),
): Map<string, BlogList> {
  return groupBlogListByMonth(filterBlogListByTimeRage(blogList, start, end));
}

export function getDayTimeline(blogsGroupedByDate: BlogsGroupedByDate, date: Date): Map<string, BlogList> {
  const res = new Map<string, BlogList>();
  const key = toLocalYMD(date);
  const blogList = blogsGroupedByDate.get(key);
  if (blogList !== undefined) {
    res.set(key, blogList);
  }
  return res;
}

export function filterBlogListByTimeRage(
  blogList: BlogList,
  start: Date = sundayWeeksAgo(new Date(), 52),
  end: Date = new Date(),
): BlogList {
  start = startOfDay(start);
  end = endOfDay(end);
  const startBlog = {
    name: '',
    path: '',
    rawTitle: '',
    title: '',
    html_url: '',
    edit_url: '',
    routerLink: '',
    created_at: start.toISOString(),
  };
  const endBlog = { ...startBlog, created_at: end.toISOString() };
  // reversed because BlogList is in non increasing order (newest first)
  const compare = (a: BlogListItem, b: BlogListItem) =>
    Date.parse(b.created_at) - Date.parse(a.created_at);
  const newestIndex = lowerBound(blogList, endBlog, compare);
  const oldestIndex = upperBound(blogList, startBlog, compare);
  return blogList.slice(newestIndex, oldestIndex);
}
