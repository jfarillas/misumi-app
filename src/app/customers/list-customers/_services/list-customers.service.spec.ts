import { TestBed } from '@angular/core/testing';

import { ListCustomersService } from './list-customers.service';

describe('ListCustomersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListCustomersService = TestBed.get(ListCustomersService);
    expect(service).toBeTruthy();
  });
});
