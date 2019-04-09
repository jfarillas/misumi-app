import { TestBed } from '@angular/core/testing';

import { ReceivablesTodayService } from './receivables-today.service';

describe('ReceivablesTodayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceivablesTodayService = TestBed.get(ReceivablesTodayService);
    expect(service).toBeTruthy();
  });
});
