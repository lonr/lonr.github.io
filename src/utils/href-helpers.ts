import Href from '@lonr/href';

/**
 * - `https://f.c/file` - `true`
 * - `//f.c/file` - `true`
 * - `path/file` - `false`
 * - `` - `false`
 * - `#foo` - `false`
 * - `?bar` - `false`
 */
export function isValidFullURL(href: string): boolean {
  let h: Href;
  try {
    h = new Href(href);
  } catch (error) {
    return false;
  }
  return h.pathname !== '' && !h.href.startsWith(h.pathname);
}

/// only query or hash diffs
export function inSamePage(url1: string, url2: string): boolean {
  const parsedUrl1 = new URL(url1);
  const parsedUrl2 = new URL(url2);
  return parsedUrl1.origin === parsedUrl2.origin && parsedUrl1.pathname === parsedUrl2.pathname;
}
