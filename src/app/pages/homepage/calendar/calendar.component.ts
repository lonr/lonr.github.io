import { formatDate } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnInit,
  Renderer2,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { parseLocalYMD } from 'src/utils/date';
import { BlogsGroupedByDate } from '../../blogs/blogs';
import { CalData, getCalData, getGraffitiCalData } from './calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @Input() groupedBlogs: BlogsGroupedByDate | null = null;
  @Input() start: Date | undefined;
  @Input() end: Date | undefined;
  @ViewChild('tooltip') tooltipElementRef!: ElementRef<HTMLElement>;

  @Output() dateSelected = new EventEmitter<Date>();

  constructor(private el: ElementRef, private renderer: Renderer2, private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.registerTooltip();
  }

  @HostListener('click', ['$event'])
  public handleClick(event: Event): void {
    const target = event.target;
    if (target instanceof Element && target.matches('rect[data-count]')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.dateSelected.emit(parseLocalYMD(target.getAttribute('data-date')!));
    }
  }

  private get tooltipElement() {
    return this.tooltipElementRef.nativeElement;
  }

  private registerTooltip() {
    // copied from github.com
    this.ngZone.runOutsideAngular(() => {
      const host = this.el.nativeElement as Element;
      host.addEventListener('mouseover', (event) => {
        const target = event.target;
        if (target instanceof Element && target.matches('rect[data-count]')) {
          this.tooltipElement.hidden = true;
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          const targetX = +target.getAttribute('x')!;
          const targetY = +target.getAttribute('y')!;
          const count = +target.getAttribute('data-count')!;
          const date = target.getAttribute('data-date')!;
          /* eslint-enable @typescript-eslint/no-non-null-assertion */
          const strongEle: HTMLElement = this.renderer.createElement('strong');
          strongEle.textContent =
            count === 0 ? 'No blogs' : count === 1 ? '1 blog' : `${count} blogs`;
          this.tooltipElement.innerHTML = '';
          this.tooltipElement.append(strongEle, ' on ', formatDate(date, 'mediumDate', 'en-US'));
          // ele.offsetWidth returns 0 if the ele is hidden
          this.tooltipElement.hidden = false;
          const top = targetY - 25 + 'px';
          const left = 210.5 - this.tooltipElement.offsetWidth / 2 - targetX * 13 + 'px';
          this.tooltipElement.style.top = top;
          this.tooltipElement.style.left = left;
        }
      });
      host.addEventListener('mouseout', () => {
        this.tooltipElement.hidden = true;
      });
    });
  }

  getCalData() {
    if (this.groupedBlogs === null) {
      return getGraffitiCalData();
    } else {
      return getCalData(this.groupedBlogs, this.start, this.end);
    }
  }

  // @HostListener('mouseout', ['$event'])
  // public handleMouseOut(event: Event): void {
  //   console.log(2);
  //   this.tooltip = null;
  // }
}
