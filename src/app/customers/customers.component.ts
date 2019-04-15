import { 
  Component, 
  OnInit,
  Input, 
  Output,
  EventEmitter,
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

  @Input() listCustomers: any = [];
  @Input() updateProfile: any;
  @Input() getCustomer: any;
  @Output() pushCustomers: EventEmitter<any> = new EventEmitter();
  @Output() pushGetCustomer: EventEmitter<any> = new EventEmitter();
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

  // For validation
  isValid: boolean = true;
  isValidEdit: boolean = true;

  // Check if the form is in the "Update Details" tab
  updateDetails: boolean;

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
    // Change the layout of this template when it is in tab
    if (!this.getCustomer) {
      this.updateDetails = false;
    } else {
      const regDateSplit = this.getCustomer.registrationDate.split('-');
      const regDateUpdate = new Date(regDateSplit[0]+'-'+regDateSplit[1]+'-'+regDateSplit[2]);
      this.updateDetails = true;
      this.customer.customerKey = this.getCustomer.customerKey;
      this.customer.businessRegNo = this.getCustomer.businessRegNo;
      this.customer.name = this.getCustomer.name;
      this.customer.registrationDate = {year: regDateUpdate.getFullYear(), month: regDateUpdate.getMonth()+1, day: regDateUpdate.getDate()};
      this.customer.streetName = this.getCustomer.streetName;
      this.customer.buildingName = this.getCustomer.buildingName;
      this.customer.unitNo = this.getCustomer.unitNo;
      this.customer.postalCode = this.getCustomer.postalCode;
      this.customer.bankAccountNo = this.getCustomer.bankAccountNo;
      this.customer.contactNo = this.getCustomer.contactNo;
      this.customer.contactName = this.getCustomer.contactName;
      this.customer.email = this.getCustomer.email;
      this.customer.faxNo = this.getCustomer.faxNo;
      this.customer.contactMisc = this.getCustomer.contactMisc;
      this.selectedGender = this.getCustomer.gender;
      this.customer.origin = this.getCustomer.origin;
      this.customer.salesDetails = this.getCustomer.salesDetails;
      this.customer.paymentDetails = this.getCustomer.paymentDetails;
      this.customer.bankingDetails = this.getCustomer.bankingDetails;
      this.customer.miscDetails = this.getCustomer.miscDetails;
      this.customer.remarks = this.getCustomer.remarks;
    }
    console.log(this.getCustomer);
    // Country filters
    this.country$ = this.dataService.getCountries();
    this.dataService.getCountries().subscribe(countries => {
      this.countries = countries;
      this.selectedCountryCode = countries[0].code;
      const defaultCountry = countries.find((country: { code: any; name: any; }) => country.code === 'SG');
      this.selectedCountryCode = defaultCountry.code;
      // For Update Details
      if (this.getCustomer) {
        const selectedCountry = countries.find((country: { code: any; name: any; }) => country.code === this.getCustomer.country);
        this.selectedCountryCode = selectedCountry.code;
      }
    });

    // Status filters
    this.status$ = this.dataService.getCustomerStatus();
    this.dataService.getCustomerStatus().subscribe(status => {
      this.status = status;
      this.selectedStatusCode = this.status[0].code;
      // For Update Details
      if (this.getCustomer) {
        const selectedStatus = status.find((status: { code: any; description: any; }) => status.code === this.getCustomer.status);
        this.selectedStatusCode = selectedStatus.code;
      }
    });
  }

  addCustomer(f: {
    reset: () => void;
  }, event: Event) {
    this.resetErrors();
    // Update customer details when there's only an existing customer ID
    // otherwise add new customer
    // Fields checker
    let regUnitNo = RegExp('^[a-zA-Z0-9#-]+$', 'i');
    let regPostalCode = RegExp('^[a-zA-Z0-9]+$', 'i');
    let regEmail = RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$', 'i');
    let regContactNo = RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-#*0-9]*$', 'i');
    let regFaxNo = RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-#*0-9]*$', 'i');
    if (!this.getCustomer) {
      event.preventDefault();
      // Validation rules
      const invalidFields = !this.customer.customerKey || !this.customer.businessRegNo || !this.customer.name 
      || !this.customer.registrationDate || Object.prototype.toString.call(this.customer.registrationDate) !== '[object Object]' || !this.customer.streetName || !this.customer.buildingName 
      || !this.customer.unitNo || !regUnitNo.test(this.customer.unitNo) || !this.customer.postalCode || !regPostalCode.test(this.customer.postalCode) || !this.customer.bankAccountNo 
      || !this.customer.contactNo || !regContactNo.test(this.customer.contactNo) || (this.customer.faxNo.length > 0 && !regFaxNo.test(this.customer.faxNo)) || !this.customer.contactName 
      || !this.customer.email || !regEmail.test(this.customer.email) || !this.selectedGender || !this.customer.origin;
      if (invalidFields) {
        this.isValid = false;
      } else {
        this.isValid = true;
        this.updateProperties();
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
    } else {
      event.preventDefault();
      // Validation rules
      const invalidFields = !this.customer.customerKey || !this.customer.businessRegNo || !this.customer.name 
      || !this.customer.registrationDate || Object.prototype.toString.call(this.customer.registrationDate) !== '[object Object]' || !this.customer.streetName || !this.customer.buildingName 
      || !this.customer.unitNo || !regUnitNo.test(this.customer.unitNo) || !this.customer.postalCode || !regPostalCode.test(this.customer.postalCode) || !this.customer.bankAccountNo 
      || !this.customer.contactNo || !regContactNo.test(this.customer.contactNo) || (this.customer.faxNo.length > 0 && !regFaxNo.test(this.customer.faxNo)) || !this.customer.contactName 
      || !this.customer.email || !regEmail.test(this.customer.email) || !this.selectedGender || !this.customer.origin;
      if (invalidFields) {
        this.isValidEdit = false;
      } else {
        this.isValidEdit = true;
        this.customer['customerId'] = this.getCustomer.customerId;
        this.updateProperties();
        this.customerService.update(this.customer)
        .subscribe((res: Customers[]) => {
          // Update the list of customers
          this.listCustomers = res;
          console.log(this.listCustomers);
          // Update customers list
          this.pushCustomers.emit(this.listCustomers);
          // Update customer profile
          this.pushGetCustomer.emit(this.listCustomers);
          // Inform the user
          this.success = 'Updated successfully';
          this.ref.detectChanges();
        }, (err) => {
          this.error = err;
          // Check if the customer data has been added
          this.ref.detectChanges();
        });
      }
    }

  }

  updateProperties() {
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
    this.customer.regDateYear = regYearDateFormat;
    this.customer.regDateMonth = regMonthDateFormat;
    this.customer.regDateDay = regDayDateFormat
  }
  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
