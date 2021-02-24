import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoteProfile, getFinalProfile, Profile } from './profile';
import { buildContact, ContactItem } from './contact';
import { API_BASE_URL, DEFAULT_HEADERS } from '../github/github';
import CUSTOM_CONFIG from 'src/custom.config';
import { GITHUB_URL } from '../github/github';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // Why ReplaySubject: https://stackoverflow.com/questions/44693438/behaviour-subject-initial-value-null
  profile$ = new ReplaySubject<Profile>();
  contact$ = new ReplaySubject<ContactItem[]>();
  // readme

  constructor(private http: HttpClient) {
    this.setProfile$();
    this.setContact$();
  }

  get blogRepo$() {
    return this.profile$.pipe(map(({ login }) => `${login}/${login}.github.io`));
  }

  get portfolioRepos$() {
    return of(CUSTOM_CONFIG.PORTFOLIO_REPOS);
  }

  get readmeMeta$(): Observable<{ repo: string; path: string }> {
    return this.profile$.pipe(
      map(({ login }) => {
        const customReadme = CUSTOM_CONFIG.CUSTOM_README;
        if (customReadme) {
          return {
            repo: `${login}/${login}.github.io`,
            path: customReadme,
          };
        } else {
          return {
            repo: `${login}/${login}`,
            path: 'README.md',
          };
        }
      }),
    );
  }

  private setProfile$() {
    const login = CUSTOM_CONFIG.LOGIN;
    const customProfile = CUSTOM_CONFIG.CUSTOM_PROFILE;

    if (login) {
      this.fetchProfile(login)
        .pipe(map((profile: RemoteProfile) => getFinalProfile(profile, customProfile)))
        .subscribe(this.profile$);
    } else {
      this.profile$.next(getFinalProfile(null, customProfile));
    }
  }

  private fetchProfile(login: string): Observable<RemoteProfile> {
    const url = `${API_BASE_URL}/users/${login}`;
    return this.http.get<RemoteProfile>(url, { headers: DEFAULT_HEADERS });
  }

  private setContact$() {
    const customContact = CUSTOM_CONFIG.CUSTOM_CONTACT;

    this.profile$.subscribe((profile: RemoteProfile) => {
      this.contact$.next(buildContact(profile, customContact));
    });
  }
}
