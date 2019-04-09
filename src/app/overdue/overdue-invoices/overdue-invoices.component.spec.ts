import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueInvoicesComponent } from './overdue-invoices.component';

describe('OverdueInvoicesComponent', () => {
  let component: OverdueInvoicesComponent;
  let fixture: ComponentFixture<OverdueInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
