import { Component, Input, OnInit } from '@angular/core';
import { BlogList } from '../../blogs/blogs';
import { BlogsService } from '../../blogs/blogs.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {

  constructor(public blogs: BlogsService) {}
  ngOnInit(): void {}
}
