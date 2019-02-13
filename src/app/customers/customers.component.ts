import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy, 
  ViewChild, 
  ChangeDetectorRef 
} from '@angular/core';
import { Customers } from './customers';
import { CustomersService } from './_services/customers.service';

import { DataService, Country, CustomerStatus } from '../shared/data.service';
// import { NgbDateCustomParserFormatter } from '../shared/dateformat';

import { FormControl, NgForm, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateWholeCustomParserFormatter } from "../shared/dateformatwhole";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customer',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateWholeCustomParserFormatter}
  ]
})
export class CustomersComponent implements OnInit {

  customers: Customers[];
  error = '';
  success = '';
  customer = new Customers('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

  // Gender
  genders: any[] = [
    {
      "value": "male",
      "label": "Male"
    },
    {
      "value": "female",
      "label": "Female"
    }
  ];
  selectedGender: string = 'male';

  constructor(
    private customerService: CustomersService,
    private dataService: DataService,
    private ref: ChangeDetectorRef
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

  addCustomer(f: {
    reset: () => void;
  }) {
    this.resetErrors();

    // Update the properties in customer model with the value from ng-select or standalone specific form field/s.
    console.log('Country new prop value :: '+this.selectedCountryCode+' Status new prop value :: '+this.selectedStatusCode);
    this.customer.country = this.selectedCountryCode;
    this.customer.status = this.selectedStatusCode;
    this.customer.gender = this.selectedGender;

    // Date format for DB
    let registrationDateFormat: object = Object.values(this.customer.registrationDate);
    let regYearDateFormat: string = registrationDateFormat[0];
    let regMonthDateFormat: string = (registrationDateFormat[1] < 10) ? '0'+registrationDateFormat[1] : registrationDateFormat[1];
    let regDayDateFormat: string = (registrationDateFormat[2] < 10) ? '0'+registrationDateFormat[2] : registrationDateFormat[2];
    console.log(regYearDateFormat+'-'+regMonthDateFormat+'-'+regDayDateFormat);
    this.customer.regDateYear = regYearDateFormat;
    this.customer.regDateMonth = regMonthDateFormat;
    this.customer.regDateDay = regDayDateFormat

    this.customerService.store(this.customer)
      .subscribe((res: Customers[]) => {
        // Update the list of customers
        this.customers = res;
        // Inform the user
        this.success = 'Created successfully';
        // Reset the form
        f.reset();
      }, (err) => {
        this.error = err;
        // Check if the customer data has been added
        this.ref.detectChanges();
      });
  }
  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
