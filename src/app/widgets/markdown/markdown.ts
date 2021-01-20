import { dirname, join } from 'src/utils/path';
const BRANCH = 'main';

export interface MarkdownMeta {
  source: string;
  // `lonr/lonr.github.io`
  repo: string;
  // `blog/README.md`, `blog/blogs/hello-word.md`
  // Can be extracted from source
  path: string;
  // `https://lonr.github.io/about`, `https://lonr.github.io/blog/hello-word`, `https://lonr.dev/about`
  href: string;
}

export function isProfileRepo(repo: string) {
  const [login, repoName] = repo.split('/');
  return login === repoName;
}

export function isAnchor(href: string): boolean {
  return href.startsWith('#');
}

export function isAbsolute(href: string): boolean {
  return href.startsWith('/');
}

// Blog markdown file in `blog/blogs` folder or `README.md` in `blog` folder
export function isLinkableMd(href: string, path: string, repo: string) {
  return isHrefToMd(href) && isInBlogFolder(href, path) && !isProfileRepo(repo);
}

export function isInBlogFolder(href: string, path: string): boolean {
  return join(path, href).startsWith('blog');
}

export function isHrefToMd(href: string): boolean {
  return href.split('?')[0].split('#')[0].endsWith('.md');
}

// https://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative#comment68271257_31991870
// `https://foo.com` and `//foo.com` are 'complete' URLs
// But `/bar` is not, it's an absolute URL though
export function isFullURL(href: string): boolean {
  const re = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
  return re.test(href);
}

export function getFullURL(src: string, path: string, base: string): string {
  const pathFromRoot = join(dirname(path), src);
  return new URL(pathFromRoot, base).href;
}

export function getBlobBaseURL(repo: string) {
  return `https://github.com/${repo}/blob/${BRANCH}/`;
}

export function getRawBaseURL(repo: string) {
  return `https://github.com/${repo}/raw/${BRANCH}/`;
}
