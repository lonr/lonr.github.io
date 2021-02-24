import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BlogList, BlogsGroupedByDate } from '../../blogs/blogs';
import { filterBlogListByTimeRage, getDayTimeline, getMonthTimeline } from './timeline';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnChanges {
  @Input() sortedBlogList!: BlogList;
  @Input() groupedBlogs!: BlogsGroupedByDate;
  @Input() start: Date | undefined;
  @Input() end: Date | undefined;
  @Input() selectedDate: Date | undefined;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // const timeline = getMonthTimeline(this.sortedBlogList);
    const blogs = filterBlogListByTimeRage(this.sortedBlogList, this.start, this.end);
  }

  getTimelineData() {
    if (this.selectedDate === undefined) {
      return getMonthTimeline(this.sortedBlogList, this.start, this.end);
    } else {
      return getDayTimeline(this.groupedBlogs, this.selectedDate);
    }
  }
}
