import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtterancesComponent } from './utterances.component';



@NgModule({
  declarations: [UtterancesComponent],
  exports: [UtterancesComponent],
  imports: [
    CommonModule
  ]
})
export class UtterancesModule { }
