import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PortfolioComponent],
  imports: [CommonModule, SharedModule,PortfolioRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PortfolioModule {}
