import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconDirective } from './icon.directive';

@Component({
  template: `<div><template appIcon="link"></template></div>`,
})
class TestComponent {}

describe('IconDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [IconDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges();

    element = fixture.nativeElement;
  });

  it('should replace template with svg', () => {
    expect(element.querySelector('svg')).toBeDefined();
  });

  it('should create the link svg', () => {
    expect(element.querySelector('svg')?.outerHTML).toContain('octicon-link');
  });
});
