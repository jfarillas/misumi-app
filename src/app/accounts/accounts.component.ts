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

  // Designation selections
  designation_options: any = ['Admin', 'Director', 'Manager', 'Staff'];
  
  constructor(
    private accountService: AccountsService,
    private ref: ChangeDetectorRef
  ) {
  }
  ngOnInit() {
    // Designation filters
    this.account.designation = 'Staff';
  }

  addAccount(f: {
    reset: () => void;
  }) {
    this.resetErrors();

    // Update the designation property in customer model with the value from angular material specific form field/s.
    //this.account.designation = this.frmDesignationControl.value;

    this.accountService.store(this.account)
      .subscribe((res: Accounts[]) => {
        // Update the list of accounts
        this.accounts = res;
        // Inform the user
        this.success = 'Created successfully';
        // Reset the form
        f.reset();
        // Retain selection default value
        this.account.designation = 'Staff';
      }, (err) => {
        this.error = err;
        // Check if the account data has been added
        this.ref.detectChanges();
      });
  }
  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
