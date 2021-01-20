import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AvatarComponent } from './layout/avatar/avatar.component';
import { NavComponent } from './layout/nav/nav.component';
import { TocComponent } from './layout/toc/toc.component';
import { ContactComponent } from './layout/contact/contact.component';

@NgModule({
  declarations: [AppComponent, AvatarComponent, NavComponent, TocComponent, ContactComponent],
  imports: [BrowserModule, HttpClientModule, SharedModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
