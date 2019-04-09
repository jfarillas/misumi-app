import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsReceivablesComponent } from './details-receivables.component';

describe('DetailsReceivablesComponent', () => {
  let component: DetailsReceivablesComponent;
  let fixture: ComponentFixture<DetailsReceivablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsReceivablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
