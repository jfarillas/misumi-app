import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Customers } from './customers';
import { CustomersService } from './_services/customers.service';

import { DataService, Country, CustomerStatus } from '../shared/data.service';

import { FormControl, NgForm, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customer',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customers[];
  error = '';
  success = '';
  customer = new Customers('', '', '', '', '', '', '', '', '', '');

  constructor(
    private customerService: CustomersService,
    private dataService: DataService
  ) {}
  countries: Country[] = [];
  status: CustomerStatus[] = [];
  country$: Observable<Country[]>;
  status$: Observable<CustomerStatus[]>;
  selectedCountryCode: string = null;
  selectedStatusCode: string = null;

  ngOnInit() {
    // Country filters
    this.country$ = this.dataService.getCountries();
    this.dataService.getCountries().subscribe(countries => {
      this.countries = countries;
      this.selectedCountryCode = countries[0].code;
      console.log(this.selectedCountryCode);
      this.customer.country = this.selectedCountryCode;
      console.log('Country prop value :: '+this.customer.country);
    });

    // Status filters
    this.status$ = this.dataService.getCustomerStatus();
    this.dataService.getCustomerStatus().subscribe(status => {
      this.status = status;
      this.selectedStatusCode = this.status[0].code;
      console.log(this.selectedStatusCode);
      this.customer.status = this.selectedStatusCode;
      console.log('Status prop value :: '+this.customer.status);
    });
  }

  /* getAccounts(): void {
    this.customerService.getAll().subscribe((res: Account[]) => {
      this.customers = res;
    }, (err) => {
      this.error = err;
    });
  } */
  addCustomer(f: {
    reset: () => void;
  }) {
    this.resetErrors();

    // Update the properties in customer model with the value from ng-select or standalone specific form field/s.
    console.log('Country new prop value :: '+this.selectedCountryCode+' Status new prop value :: '+this.selectedStatusCode);
    this.customer.country = this.selectedCountryCode;
    this.customer.status = this.selectedStatusCode;

    this.customerService.store(this.customer)
      .subscribe((res: Customers[]) => {
        // Update the list of customers
        this.customers = res;
        // Inform the user
        this.success = 'Created successfully';
        // Reset the form
        f.reset();
      }, (err) => this.error = err);
  }
  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
