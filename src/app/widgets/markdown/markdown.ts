import Href from '@lonr/href';
import { isValidFullURL } from 'src/utils/href-helpers';

const BRANCH = 'main';

export interface MarkdownMeta {
  source: string;
  // `lonr/lonr.github.io`
  repo: string;
  // `blog/README.md`, `blog/blogs/hello-word.md`
  // Can be extracted from source
  path: string;
}

function isProfileRepo(repo: string) {
  const [login, repoName] = repo.split('/');
  return login === repoName;
}

// Blog markdown file under the `blog/blogs` folder or `README.md` under the `blog` folder
function isLinkableMd(pathname: string) {
  return (
    pathname.startsWith('blog/README.md') ||
    (pathname.startsWith('blog/blogs') &&
      pathname.match(/\/\d{4}-\d{1,2}-\d{1,2}(?:-\d+)?-.+\.md$/))
  );
}

function getBlobBaseURL(repo: string) {
  return `https://github.com/${repo}/blob/${BRANCH}/`;
}

function getRawBaseURL(repo: string) {
  return `https://github.com/${repo}/raw/${BRANCH}/`;
}

export function fix(element: HTMLElement, markdownMeta: MarkdownMeta) {
  fixImages(element, markdownMeta);
  fixHrefs(element, markdownMeta);
}

/**
 * resolves `href` in an `<a>`(or `src` in an `<img>`) tag that in a repo
 *
 * @param {string} href `href` or `src`. Allows complete or incomplete URLs
 * @param {string} filePath the location of the markdown file, which relatives to the repo root
 * @param {string} repoRoot the repo root URL
 * @return {string}
 */
function getFullURL(href: string, filePath: string, repoRoot: string): string {
  if (isValidFullURL(href)) {
    return href;
  }
  const pathFromRoot = new Href(href, filePath); // href may be an absolute(complete) URL(ignoring fileBase in this case)
  return new Href(`${repoRoot}${pathFromRoot.href.replace(/^\/*/, '')}`).href;
}

function fixImages(element: HTMLElement, { path, repo }: MarkdownMeta) {
  const images = element.getElementsByTagName('img');
  for (const image of images) {
    const srcAttr = image.getAttribute('src');
    if (srcAttr) {
      // There is a `/` at the end!
      const base = getRawBaseURL(repo);
      const src = getFullURL(srcAttr, path, base);
      image.setAttribute('src', src);

      // GitHub adds an `<a>` tag for each relative `<img>` not surrounded by an `<a>` tag
      // https://stackoverflow.com/questions/40625614/is-it-possible-to-disable-the-automatic-linking-of-images-in-github-markdown-ren/48744957
      // just let fixHrefs fix that
    }
  }
}

function fixHrefs(element: HTMLElement, { path, repo }: MarkdownMeta): void {
  const anchors = element.getElementsByTagName('a');

  for (const anchor of anchors) {
    const hrefAttr = anchor.getAttribute('href');
    if (hrefAttr) {
      if (isValidFullURL(hrefAttr)) {
        continue;
      }
      let res = new Href(hrefAttr, path);
      if (!isProfileRepo(repo) && isLinkableMd(res.pathname)) {
        if (res.pathname.startsWith('blog/README.md')) {
          res.pathname = '/about';
        } else {
          res.pathname = res.pathname.replace(/\.md$/, '');
          res.pathname = res.pathname.replace(/^blog\/blogs\//, '/blog/');
          anchor.classList.add('on-site-link');
        }
      } else {
        const repoRoot = getBlobBaseURL(repo);
        res = new Href(`${repoRoot}${res.href.replace(/^\/*/, '')}`);
      }
      anchor.setAttribute('href', res.href);
    }
  }
}
