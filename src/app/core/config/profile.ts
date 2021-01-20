/** Profile returned by `` `https://api.github.com/users/${login}` ``*/
export interface RemoteProfile {
  avatar_url: string;
  login: string;
  // Defaults to `https://github.com/${profile.login}`
  html_url: string;
  // Defaults to login's value
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  // Returns an empty string if there is no blog
  blog: string;
  email: string | null;
}

export type Profile = Omit<RemoteProfile, 'name'> & { name: string };

const emptyProfile: RemoteProfile = {
  avatar_url: '',
  login: '',
  html_url: '',
  name: null,
  bio: null,
  company: null,
  location: null,
  blog: '',
  email: null,
};

export type CustomProfile = Partial<RemoteProfile>;

function mergeProfiles(profile: RemoteProfile, customProfile: CustomProfile): RemoteProfile {
  return { ...profile, ...customProfile };
}

function completeProfile(profile: RemoteProfile): Profile {
  return {
    ...profile,
    ...{
      name: profile.name || profile.login,
      html_url: profile.html_url || `https://github.com/${profile.login}`,
    },
  };
}

export function getFinalProfile(
  base: RemoteProfile | null,
  customProfile: CustomProfile,
): Profile {
  if (base !== null) {
    return completeProfile(mergeProfiles(base, customProfile));
  } else {
    return completeProfile(mergeProfiles(emptyProfile, customProfile));
  }
}
