import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { parseLocalYMD } from 'src/utils/date';
import { BlogsService } from '../../blogs/blogs.service';
import { getYearFilters, YearFilter } from './activity';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  start?: Date;
  end?: Date;
  selectedDate?: Date;

  constructor(public blogs: BlogsService, private route: ActivatedRoute, private router: Router) {}

  getYearFilters() {
    return this.blogs
      .getSortedBlogList()
      .pipe(map((sortedBlogList) => getYearFilters(sortedBlogList)));
  }

  changeSelectedDate($event: Date) {
    this.selectedDate = $event;
  }

  isFilterActive(filter: YearFilter, index: number): 'page' | null {
    if (this.selectedDate === undefined) {
      return index === 0 ? 'page' : null;
    } else {
      return this.selectedDate.getFullYear() === filter.year ? 'page' : null;
    }
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap) => {
      console.log(paramMap);
      const start = paramMap.get('start');
      const end = paramMap.get('end');
      this.selectedDate = this.start = start ? parseLocalYMD(start) : undefined;
      this.end = end ? parseLocalYMD(end) : undefined;
    });

    // reset selectedDate
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.selectedDate = undefined;
      });
  }
}
