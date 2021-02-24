import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TimelineComponent } from './timeline/timeline.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivityComponent } from './activity/activity.component';


@NgModule({
  declarations: [HomepageComponent, CalendarComponent, TimelineComponent, ActivityComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomepageRoutingModule
  ]
})
export class HomepageModule { }
