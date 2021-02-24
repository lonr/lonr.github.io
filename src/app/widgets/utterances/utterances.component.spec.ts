import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtterancesComponent } from './utterances.component';

describe('UtterancesComponent', () => {
  let component: UtterancesComponent;
  let fixture: ComponentFixture<UtterancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtterancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtterancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
