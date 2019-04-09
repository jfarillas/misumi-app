import { TestBed } from '@angular/core/testing';

import { OverdueInvoicesService } from './overdue-invoices.service';

describe('OverdueInvoicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverdueInvoicesService = TestBed.get(OverdueInvoicesService);
    expect(service).toBeTruthy();
  });
});
