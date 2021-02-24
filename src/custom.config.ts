import { CustomProfile } from './app/core/config/profile';
import { CustomContact } from './app/core/config/contact';

/**
 * Options:
 *  1. Your GitHub login name, eg, `'lonr'`
 *    - Will use the profile info returned by `https://api.github.com/users/${LOGIN}` as default
 *    - Profile info returned can be overridden by `CUSTOM_PROFILE`
 *    - This option takes one more request than option 2
 *  2. `''` (empty string) - Will use profile info from hardcoded `CUSTOM_PROFILE` only
 */
const LOGIN = '';

/** Repos listed in the Portfolio page */
const PORTFOLIO_REPOS: string[] = ['lonr/lonr.github.io', 'zicijs/zici-webext'];

/**
 * See `src/app/core/config/profile.ts` for properties available
 * 1. If `LOGIN` was not set, you should provide
 *    `avatar_url, login, bio` at least (`name` defaults to `login` if not provided))
 * 2. If `LOGIN` was set, you can:
 *   1. Set this to a false value or `{}` to keep the profile info returned untouched
 *   2. Override some properties
 */
// const customProfile: Partial<Profile> = {};
const CUSTOM_PROFILE: CustomProfile = {
  avatar_url: 'assets/images/avatar.svg',
  login: 'lonr',
  name: 'lonr',
  bio: '🐟🧂是因为他咬了📏🪝上的🪤',
  blog: 'https://lonr.github.io',
  email: 'lonr@live.cn',
};

/**
 * Customize the contact info
 * 1. `[]` - `[{ type: 'company' }, { type: 'location' }, { type: 'email' }, { type: 'blog' }, { type: 'github' },];`
 *    with corresponding icons and the info from the profile will be used
 * 2. Not an empty array - Only contact items listed will be displayed
 * - See `app/core/config/contact.ts` for more info
 * - Look at https://primer.style/octicons/ for icons available
 */
const CUSTOM_CONTACT: CustomContact = [
  // E.g.,
  // { type: 'custom', icon: 'mortar-board', text: 'homeschooling'},
  { type: 'github', text: '@lonr' },
  { type: 'email' },
  { type: 'blog', text: 'lonr.github.io' },
];

/**
 * Which `.md` to render in About page
 * 1. `''` - `` `${login}/${login}/README.md` `` will be used
 *   - see https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/managing-your-profile-readme
 * 2. A markdown file in the repo to use, eg, `blog/README.md`
 */
const CUSTOM_README = 'blog/README.md';

/** The time zone in which you write blogs (the handwritten date).
 *  The `created_at` date of blog `2021-1-1-blog.md` will be set to `2021-01-01T12:00+08:00`,
 *    as if it was created at 12:00am in `BLOG_TIME_ZONE`.
 *  Date strings showed finally are in visitors' local time zone
 */
// const BLOG_TIME_ZONE = 'Z'; // Defaults to 'Z' (stands for UTC time)
const BLOG_TIME_ZONE = '+08:00';


/** How many blogs per page. Defaults to 15*/
const BLOGS_PER_PAGE = 15;

/**
 * Which repo the blog project resides in. Default to `${login}/${login}.github.io`
 * **This option doesn't work now**
 */
// const CUSTOM_BLOG_REPO = 'lonr/lonr.github.io';
// const CUSTOM_BLOG_REPO = '';

/**
 * - **This option doesn't work now**
 * Custom domain, eg, `'lonr.dev'`. `window.location` is used now
 */
// const CUSTOM_DOMAIN = '';

const CUSTOM_CONFIG = {
  LOGIN,
  PORTFOLIO_REPOS,
  CUSTOM_PROFILE,
  CUSTOM_CONTACT,
  CUSTOM_README,
  BLOG_TIME_ZONE,
  BLOGS_PER_PAGE,
};

export default CUSTOM_CONFIG;
