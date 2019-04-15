import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Accounts } from './accounts';
import { AccountsService } from './_services/accounts.service';

import { FormControl, NgForm, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts: Accounts[];
  error = '';
  success = '';
  account = new Accounts('', '', '', '', '');
  hasUserName = localStorage.getItem('currentUser') !== null ? true : false;

  // Designation selections
  designation_options: any = ['Admin', 'Director', 'Manager', 'Staff'];

  // For validation
  isValid: boolean = true;
  
  constructor(
    private accountService: AccountsService,
    private ref: ChangeDetectorRef
  ) {
  }
  ngOnInit() {
    // Designation filters
    // Remove staff from the designation options if the account to be added is admin, director or manager
    if (localStorage.getItem('designation') === null) {
      this.designation_options.splice(3, 1);
      this.account.designation = 'Admin';
    } else {
      this.account.designation = 'Staff';
    }

    switch (localStorage.getItem('designation')) {
      case 'admin':
        this.designation_options.splice(0, 1);
        this.account.designation = 'Director';
      break;
      case 'director':
        this.designation_options.splice(0, 2);
        this.account.designation = 'Manager';
      break;
      case 'manager':
        this.designation_options.splice(0, 3);
        this.account.designation = 'Staff';
      break;
    }
    
    console.log(this.hasUserName);
  }

  addAccount(f: {
    reset: () => void;
  }, event: Event) {
    this.resetErrors();

    // Update the designation property in customer model with the value from angular material specific form field/s.
    //this.account.designation = this.frmDesignationControl.value;

    // Email and Contact No. checker
    let regEmail = RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$', 'i');
    let regContactNo = RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-#*0-9]*$', 'i');
    event.preventDefault();
    // Validation rules
    const invalidFields = !this.account.name || !this.account.password || !this.account.email 
    || !regEmail.test(this.account.email) || !this.account.contactNo || !regContactNo.test(this.account.contactNo);
    if (invalidFields) {
      this.isValid = false;
    } else {
      console.log(this.account.designation);
      if (this.account.designation !== 'Staff' || localStorage.getItem('designation') !== null) {
        this.accountService.store(this.account)
        .subscribe((res: Accounts[]) => {
          // Update the list of accounts
          this.accounts = res;
          // Inform the user
          this.success = 'Created successfully';
          // Reset the form
          //f.reset();
          // Retain selection default value
          this.account.designation = 'Staff';
        }, (err) => {
          this.error = err;
          // Check if the account data has been added
          this.ref.detectChanges();
        });
      } else {
        this.error = this.account.designation+' cannot create user account.';
        // Check if the account data has been added
        this.ref.detectChanges();
      }
    }
    
    
  }
  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
