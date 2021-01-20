import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/core/config/config.service';
import { MarkdownMeta } from 'src/app/widgets/markdown/markdown';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  markdownMeta$!: Observable<MarkdownMeta>;

  constructor(@Inject(DOCUMENT) private document: Document, private config: ConfigService) {
    // this.markdownMeta$=this.config.readmeMeta$.pipe(map((readmeMeta) => ({
    //   source: source,
    //   repo: readmeMeta.repo,
    //   path: readmeMeta.path,
    //   href: this.document.location.href
    // })));
  }

  ngOnInit(): void {
    this.markdownMeta$ = of({
      source: source,
      repo: 'angular/angular',
      path: 'README.md',
      href: this.document.location.href,
    });
  }
}

const source = `<div id="readme" class="md" data-path="README.md"><article class="markdown-body entry-content container-lg" itemprop="text"><h1 align="center"><a id="user-content-angular---one-framework-mobile--desktop" class="anchor" aria-hidden="true" href="#angular---one-framework-mobile--desktop"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Angular - One framework. Mobile &amp; desktop.</h1>
<p align="center">
  <a target="_blank" rel="noopener noreferrer" href="aio/src/assets/images/logos/angular/angular.png"><img src="aio/src/assets/images/logos/angular/angular.png" alt="angular-logo" width="120px" height="120px" style="max-width:100%;"></a>
  <br>
  <i>Angular is a development platform for building mobile and desktop web applications
    <br> using Typescript/JavaScript and other languages.</i>
  <br>
</p>
<p align="center">
  <a href="https://www.angular.io" rel="nofollow"><strong>www.angular.io</strong></a>
  <br>
</p>
<p align="center">
  <a href="CONTRIBUTING.md">Contributing Guidelines</a>
  ·
  <a href="https://github.com/angular/angular/issues">Submit an Issue</a>
  ·
  <a href="https://blog.angular.io/" rel="nofollow">Blog</a>
  <br>
  <br>
</p>
<p align="center">
  <a href="https://circleci.com/gh/angular/workflows/angular/tree/master" rel="nofollow">
    <img src="https://camo.githubusercontent.com/de85a05dd455c4aaf5de626ecd9dd67147585c54cd0f52f16c8feb9740235fbe/68747470733a2f2f696d672e736869656c64732e696f2f636972636c6563692f6275696c642f6769746875622f616e67756c61722f616e67756c61722f6d61737465722e7376673f6c6f676f3d636972636c656369266c6f676f436f6c6f723d666666266c6162656c3d436972636c654349" alt="CI status" data-canonical-src="https://img.shields.io/circleci/build/github/angular/angular/master.svg?logo=circleci&amp;logoColor=fff&amp;label=CircleCI" style="max-width:100%;">
  </a>
  <a href="https://www.npmjs.com/@angular/core" rel="nofollow">
    <img src="https://camo.githubusercontent.com/77afb106c5d247ed3488e658f56956b4fd844057e87070353629148e09d4dfef/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f40616e67756c61722f636f72652e7376673f6c6f676f3d6e706d266c6f676f436f6c6f723d666666266c6162656c3d4e504d2b7061636b61676526636f6c6f723d6c696d65677265656e" alt="Angular on npm" data-canonical-src="https://img.shields.io/npm/v/@angular/core.svg?logo=npm&amp;logoColor=fff&amp;label=NPM+package&amp;color=limegreen" style="max-width:100%;">
  </a>
  <a href="https://discord.gg/angular" rel="nofollow">
    <img src="https://camo.githubusercontent.com/65bfbd652766916d59cb08f071d120ed3091859c37b54f8e1f846ec8431cd41e/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f3436333735323832303032363337363230322e7376673f6c6f676f3d646973636f7264266c6f676f436f6c6f723d666666266c6162656c3d446973636f726426636f6c6f723d373338396438" alt="Discord conversation" data-canonical-src="https://img.shields.io/discord/463752820026376202.svg?logo=discord&amp;logoColor=fff&amp;label=Discord&amp;color=7389d8" style="max-width:100%;">
  </a>
</p>
<hr>
<h2><a id="user-content-documentation" class="anchor" aria-hidden="true" href="#documentation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Documentation</h2>
<p>Get started with Angular, learn the fundamentals and explore advanced topics on our documentation website.</p>
<ul>
<li><a href="https://angular.io/start" rel="nofollow">Getting Started</a></li>
<li><a href="https://angular.io/guide/architecture" rel="nofollow">Architecture</a></li>
<li><a href="https://angular.io/guide/displaying-data" rel="nofollow">Components and Templates</a></li>
<li><a href="https://angular.io/guide/forms-overview" rel="nofollow">Forms</a></li>
<li><a href="https://angular.io/api" rel="nofollow">API</a></li>
</ul>
<h3><a id="user-content-advanced" class="anchor" aria-hidden="true" href="#advanced"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Advanced</h3>
<ul>
<li><a href="https://angular.io/guide/elements" rel="nofollow">Angular Elements</a></li>
<li><a href="https://angular.io/guide/universal" rel="nofollow">Server Side Rendering</a></li>
<li><a href="https://angular.io/guide/schematics" rel="nofollow">Schematics</a></li>
<li><a href="https://angular.io/guide/lazy-loading-ngmodules" rel="nofollow">Lazy Loading</a></li>
</ul>
<h2><a id="user-content-development-setup" class="anchor" aria-hidden="true" href="#development-setup"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Development Setup</h2>
<h3><a id="user-content-prerequisites" class="anchor" aria-hidden="true" href="#prerequisites"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Prerequisites</h3>
<ul>
<li>Install <a href="https://nodejs.org/" rel="nofollow">Node.js</a> which includes <a href="https://www.npmjs.com/get-npm" rel="nofollow">Node Package Manager</a></li>
</ul>
<h3><a id="user-content-setting-up-a-project" class="anchor" aria-hidden="true" href="#setting-up-a-project"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Setting Up a Project</h3>
<p>Install the Angular CLI globally:</p>
<pre><code>npm install -g @angular/cli
</code></pre>
<p>Create workspace:</p>
<pre><code>ng new [PROJECT NAME]
</code></pre>
<p>Run the application:</p>
<pre><code>cd [PROJECT NAME]
ng serve
</code></pre>
<p>Angular is cross-platform, fast, scalable, has incredible tooling, and is loved by millions.</p>
<h2><a id="user-content-quickstart" class="anchor" aria-hidden="true" href="#quickstart"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Quickstart</h2>
<p><a href="https://angular.io/start" rel="nofollow">Get started in 5 minutes</a>.</p>
<h2><a id="user-content-ecosystem" class="anchor" aria-hidden="true" href="#ecosystem"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Ecosystem</h2>
<p>
  <a target="_blank" rel="noopener noreferrer" href="/docs/images/angular-ecosystem-logos.png"><img src="/docs/images/angular-ecosystem-logos.png" alt="angular ecosystem logos" width="500px" height="auto" style="max-width:100%;"></a>
</p>
<ul>
<li><a href="https://cli.angular.io/" rel="nofollow">Angular Command Line (CLI)</a></li>
<li><a href="https://material.angular.io/" rel="nofollow">Angular Material</a></li>
</ul>
<h2><a id="user-content-changelog" class="anchor" aria-hidden="true" href="#changelog"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Changelog</h2>
<p><a href="CHANGELOG.md">Learn about the latest improvements</a>.</p>
<h2><a id="user-content-upgrading" class="anchor" aria-hidden="true" href="#upgrading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Upgrading</h2>
<p>Check out our <a href="https://update.angular.io/" rel="nofollow">upgrade guide</a> to find out the best way to upgrade your project.</p>
<h2><a id="user-content-contributing" class="anchor" aria-hidden="true" href="#contributing"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Contributing</h2>
<h3><a id="user-content-contributing-guidelines" class="anchor" aria-hidden="true" href="#contributing-guidelines"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Contributing Guidelines</h3>
<p>Read through our <a href="CONTRIBUTING.md">contributing guidelines</a> to learn about our submission process, coding rules and more.</p>
<h3><a id="user-content-want-to-help" class="anchor" aria-hidden="true" href="#want-to-help"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Want to Help?</h3>
<p>Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for <a href="CONTRIBUTING.md">contributing</a> and then check out one of our issues in the <a href="https://github.com/angular/angular/labels/hotlist%3A%20community-help">hotlist: community-help</a>.</p>
<h3><a id="user-content-code-of-conduct" class="anchor" aria-hidden="true" href="#code-of-conduct"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Code of Conduct</h3>
<p>Help us keep Angular open and inclusive. Please read and follow our <a href="CODE_OF_CONDUCT.md">Code of Conduct</a>.</p>
<h2><a id="user-content-community" class="anchor" aria-hidden="true" href="#community"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Community</h2>
<p>Join the conversation and help the community.</p>
<ul>
<li><a href="https://www.twitter.com/angular" rel="nofollow">Twitter</a></li>
<li><a href="https://gitter.im/angular/angular" rel="nofollow">Gitter</a></li>
<li>Find a Local <a href="https://www.meetup.com/find/?keywords=angular%22" rel="nofollow">Meetup</a></li>
</ul>
<p><a href="https://www.github.com/angular/angular"><img src="https://camo.githubusercontent.com/bb8c978f0a4b62e646273b8a5ea2ef05690184ae23d98109a0fc5cc5f450a6f8/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f616e67756c61722d6c6f76652d626c75653f6c6f676f3d616e67756c617226616e67756c61723d6c6f7665" alt="Love Angular badge" data-canonical-src="https://img.shields.io/badge/angular-love-blue?logo=angular&amp;angular=love" style="max-width:100%;"></a></p>
<p><strong>Love Angular? Give our repo a star <g-emoji class="g-emoji" alias="star" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2b50.png">⭐</g-emoji> <g-emoji class="g-emoji" alias="arrow_up" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2b06.png">⬆️</g-emoji>.</strong></p>
</article></div>
`;
