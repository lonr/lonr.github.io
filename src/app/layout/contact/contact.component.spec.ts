import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconDirective } from 'src/app/shared/icon/icon.directive';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconDirective, ContactComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render contact info', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('li').length).toEqual(component.contactItems.length);
  });
});
