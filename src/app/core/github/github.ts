import { HttpHeaders } from '@angular/common/http';

const GITHUB_URL = 'https://github.com';
const API_BASE_URL = 'https://api.github.com';
const JSON_MEDIA_TYPE = 'application/vnd.github.v3+json';
const TOPICS_MEDIA_TYPE = 'application/vnd.github.mercy-preview+json';

const DEFAULT_HEADERS = new HttpHeaders({
  Accept: JSON_MEDIA_TYPE,
});

const PORTFOLIO_HEADERS = DEFAULT_HEADERS.set('Accept', TOPICS_MEDIA_TYPE);

export function getRepoAPI(repoName: string) {
  return `${API_BASE_URL}/repos/${repoName}`;
}

export { API_BASE_URL, GITHUB_URL, DEFAULT_HEADERS, PORTFOLIO_HEADERS };

// Waiting for Angular 11.1 with TypeScript 4.1
// https://github.com/typescript-eslint/typescript-eslint/issues/2583
// export type RepoName = `${string}/${string}.github.io` | '';

export interface Repo {
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  forks_count: number;
  stargazers_count: number;
  has_issues: boolean;
  open_issues_count?: number;
  topics?: string[];
  updated_at: string;
  license: {
    spdx_id: string;
    url: string;
  } | null;
  // if this repo is a fork
  fork: true;
  parent?: Repo;
  [prop: string]: unknown;
}

export interface RawBlog {
  name: string;
  sha: string;
  url: string;
  html_url: string;
  type: string;
  path: string;
  [prop: string]: unknown;
}

export interface Blog {
  name: string;
  title: string | undefined;
  created_at: string;
  no: number;
  path: string;
  edit_url: string;
}
