import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  blog$?: Observable<string>;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.blog$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('id')!)),
    );
  }
}
