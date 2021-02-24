import { GITHUB_URL, RepoFile, RepoFiles } from 'src/app/core/github/github';
import CUSTOM_CONFIG from 'src/custom.config';

function decodeBlogTitle(title: string) {
  return decodeURIComponent(title);
}

/// 2021-01-20-0-Hello-World! to '[2021-01-20 0] hello world!'
export function buildIssueTerm(blogName: string) {
  const re = /^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})(?:-(?<no>\d+))?-(?<rawTitle>.+)$/;
  // Already filtered
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const groups = blogName.match(re)!.groups!;
  return `[${groups.year}-${groups.month}-${groups.day}${
    groups.no ? ' ' + groups.no : ''
  }] ${decodeBlogTitle(groups.rawTitle).replace(/-/g, ' ')}`;
}

export function files2SortedBlogs(files: RepoFiles): BlogList {
  return sortBlogListByDateAndOrder(files2BlogList(files));
}

export type BlogsGroupedByDate = Map<string, BlogList>;

export function files2GroupedByDateBlogs(files: RepoFiles): BlogsGroupedByDate {
  return groupBlogListByDate(sortBlogListByDateAndOrder(files2BlogList(files)));
}

export function groupBlogListByMonth(list: BlogList) {
  return list.reduce((prev, curr) => {
    // 2021-02
    const month = curr.created_at.slice(0, 7);
    if (prev.has(month)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      prev.get(month)!.push(curr);
    } else {
      prev.set(month, [curr]);
    }
    return prev;
  }, new Map<string, BlogList>());
}

function groupBlogListByDate(list: BlogList) {
  return list.reduce((prev, curr) => {
    const date = curr.created_at.slice(0, 10);
    if (prev.has(date)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      prev.get(date)!.push(curr);
    } else {
      prev.set(date, [curr]);
    }
    return prev;
  }, new Map<string, BlogList>());
}

export function files2PaginatedBlogLists(files: RepoFiles): BlogList[] {
  return paginateBlogList(
    sortBlogListByDateAndOrder(files2BlogList(files)),
    +(CUSTOM_CONFIG.BLOGS_PER_PAGE || 15),
  );
}

function files2BlogList(files: RepoFiles): BlogList {
  return files.map(file2BlogListItem);
}

function file2BlogListItem(file: RepoFile): BlogListItem {
  const re = /^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})(?:-(?<no>\d+))?-(?<rawTitle>.+)\.md$/;
  // Already filtered
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const groups = file.name.match(re)!.groups!;
  return {
    name: file.name,
    rawTitle: groups.rawTitle,
    title: groups.rawTitle.replace(/-/g, ' '),
    path: file.path,
    html_url: file.html_url,
    // /(?<=^https:\/\/github.com\/(?:[^/]+\/){2})blob/
    // `(?<=^${GITHUB_URL}/(?:[^/]+/){2})blob`
    edit_url: file.html_url.replace(new RegExp(`(?<=^${GITHUB_URL}/(?:[^/]+/){2})blob`), 'edit'),
    routerLink: `/blog/${file.name.replace(/\.md$/, '')}`,
    // e.g. 2017-10-26T05:19:37Z
    created_at: completeDate(groups.year, groups.month, groups.day),
    no: groups.no,
  };
}

function completeDate(year: string, month: string, day: string) {
  const suffix = `T12:00${CUSTOM_CONFIG.BLOG_TIME_ZONE || 'Z'}`;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}${suffix}`;
}

function sortBlogListByDateAndOrder(blogList: BlogList) {
  return blogList.sort((a, b) => {
    // The newer first
    const dateDiff = Date.parse(b.created_at) - Date.parse(a.created_at);
    if (dateDiff !== 0) {
      return dateDiff;
    }
    const noA = Number(a.no ?? 0);
    const noB = Number(b.no ?? 0);
    // The bigger `no` first
    if (noA !== noB) {
      return noB - noA;
    }
    // Alphabet order if they have the same `created_at` and `no`
    return new Intl.Collator().compare(a.title, b.title);
  });
}

/** Divides BlogList into parts
 * https://stackoverflow.com/a/37826698/5783347
 */
function paginateBlogList(list: BlogList, perPage: number): BlogList[] {
  return list.reduce((prev, curr, index) => {
    const chunkIndex = Math.floor(index / perPage);
    if (!prev[chunkIndex]) {
      prev[chunkIndex] = [];
    }
    prev[chunkIndex].push(curr);
    return prev;
  }, [] as BlogList[]);
}

export interface BlogListItem {
  name: string;
  path: string;
  rawTitle: string;
  title: string;
  html_url: string;
  edit_url: string;
  routerLink: string;
  created_at: string;
  no?: string;
}

export type BlogList = BlogListItem[];
