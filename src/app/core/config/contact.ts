import { RemoteProfile } from './profile';

export interface ContactItem {
  // undefined is treated as 'custom'
  type: 'company' | 'location' | 'email' | 'blog' | 'github' | 'custom';
  // for types other than 'custom', undefined `icon`, `href`, `text` will be inferred from the profile
  // look at https://primer.style/octicons/ for other icons available
  icon: string | null;
  href?: string | null;
  text: string;
}

export type Contact = Array<ContactItem>;
export type CustomContactItem =
  | ({ type: Exclude<ContactItem['type'], 'custom'> } & Partial<Omit<ContactItem, 'type'>>)
  | ({ type: 'custom' } & Omit<ContactItem, 'type'>);
export type CustomContact = Array<CustomContactItem>;

// https://www.stefanjudis.com/today-i-learned/property-order-is-predictable-in-javascript-objects-since-es2015/
// default contact. Internal use only
const templateContact: Array<{
  type: Exclude<ContactItem['type'], 'custom'>;
  getAttrs: (profile: RemoteProfile) => Omit<ContactItem, 'type'>;
}> = [
  {
    type: 'company',
    getAttrs: (profile: RemoteProfile) => ({
      icon: 'organization',
      exists: profile.company !== null,
      text: profile.company ?? '',
    }),
  },
  {
    type: 'location',
    getAttrs: (profile: RemoteProfile) => ({
      icon: 'location',
      exists: profile.location !== null,
      text: profile.location ?? '',
    }),
  },
  {
    type: 'github',
    getAttrs: (profile: RemoteProfile) => ({
      icon: 'mark-github',
      exists: !!profile.html_url,
      href: profile.html_url,
      text: `@${profile.login}`,
    }),
  },
  {
    type: 'email',
    getAttrs: (profile: RemoteProfile) => ({
      icon: 'mail',
      exists: profile.email !== null,
      href: `mailto:${profile.email as string}`,
      text: profile.email ?? '',
    }),
  },
  {
    type: 'blog',
    getAttrs: (profile: RemoteProfile) => ({
      icon: 'link',
      exists: profile.blog !== '',
      href: profile.blog,
      text: profile.blog,
    }),
  },
];

export function buildContact(profile: RemoteProfile, customContact?: Maybe<CustomContact>): Contact {
  const defaultContact = templateContact.map((templateItem) => ({
    type: templateItem.type,
    ...templateItem.getAttrs(profile),
  }));

  if (!customContact) {
    return defaultContact;
  }

  return customContact.map((customContactItem) => {
    const defaultContactItem = defaultContact.find(
      (defaultContactItem) => defaultContactItem.type === customContactItem.type,
    );
    // if defaultContactItem is undefined, then customContactItem must be a ContactItem (type: 'custom')
    return {
      ...defaultContactItem,
      ...customContactItem,
    } as ContactItem;
  });
}
