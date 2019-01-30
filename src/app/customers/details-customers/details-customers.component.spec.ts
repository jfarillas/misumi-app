import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCustomersComponent } from './details-customers.component';

describe('DetailsCustomersComponent', () => {
  let component: DetailsCustomersComponent;
  let fixture: ComponentFixture<DetailsCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
