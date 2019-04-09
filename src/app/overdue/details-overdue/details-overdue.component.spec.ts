import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOverdueComponent } from './details-overdue.component';

describe('DetailsOverdueComponent', () => {
  let component: DetailsOverdueComponent;
  let fixture: ComponentFixture<DetailsOverdueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsOverdueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsOverdueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
