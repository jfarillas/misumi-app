import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivablesTodayComponent } from './receivables-today.component';

describe('ReceivablesTodayComponent', () => {
  let component: ReceivablesTodayComponent;
  let fixture: ComponentFixture<ReceivablesTodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivablesTodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivablesTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
