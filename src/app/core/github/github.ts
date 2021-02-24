import { HttpHeaders } from '@angular/common/http';

const GITHUB_URL = 'https://github.com';
const API_BASE_URL = 'https://api.github.com';
const JSON_MEDIA_TYPE = 'application/vnd.github.v3+json';
const HTML_MEDIA_TYPE = 'application/vnd.github.v3.html';
const TOPICS_MEDIA_TYPE = 'application/vnd.github.mercy-preview+json';
const IS_TEMPLATE_TYPE = 'application/vnd.github.baptiste-preview+json';

const DEFAULT_HEADERS = new HttpHeaders({
  Accept: JSON_MEDIA_TYPE,
});

const PORTFOLIO_HEADERS = DEFAULT_HEADERS.set('Accept', TOPICS_MEDIA_TYPE + ',' + IS_TEMPLATE_TYPE);
const MARKDOWN_HTML_HEADERS = DEFAULT_HEADERS.set('Accept', HTML_MEDIA_TYPE);

export function repoAPI(repo: string) {
  return `${API_BASE_URL}/repos/${repo}`;
}

export function blogsAPI(repo: string) {
  return `${API_BASE_URL}/repos/${repo}/contents/blog/blogs`;
}

export function blogAPI(repo: string, blog: string) {
  return `${API_BASE_URL}/repos/${repo}/contents/blog/blogs/${blog}.md`;
}

export function markdownAPI(repo: string, path: string) {
  return `${API_BASE_URL}/repos/${repo}/contents/${path}`;
}

export { API_BASE_URL, GITHUB_URL, DEFAULT_HEADERS, PORTFOLIO_HEADERS, MARKDOWN_HTML_HEADERS };

// Waiting for Angular 11.1 with TypeScript 4.1
// https://github.com/typescript-eslint/typescript-eslint/issues/2583
// export type RepoName = `${string}/${string}.github.io` | '';

// https://docs.github.com/en/rest/reference/repos#get-a-repository
export interface Repo {
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string | null;
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
  is_template: boolean;
  // if this repo is a fork
  fork: true;
  parent?: Repo;
  [prop: string]: unknown;
}

// https://docs.github.com/en/rest/reference/repos#get-repository-content
export interface RepoFile {
  type: 'file' | 'dir' | 'submodule' | 'symlink';
  // 2021-01-23-00-Foo-blog.md
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  [prop: string]: unknown;
}

export type RepoFiles = RepoFile[];

export type BlogFiles = RepoFiles;

export function filterBlogFilesFromFiles(files: RepoFiles): RepoFiles {
  return files.filter((file) => {
    if (file.type === 'file' && file.name.match(/^\d{4}-\d{1,2}-\d{1,2}(?:-\d+)?-.+\.md$/)) {
      return true;
    }
    return false;
  });
}
