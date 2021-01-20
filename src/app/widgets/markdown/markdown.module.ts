import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from './markdown.component';

@NgModule({
  declarations: [MarkdownComponent],
  exports: [MarkdownComponent],
  imports: [CommonModule],
})
export class MarkdownModule {}
