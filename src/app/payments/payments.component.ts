import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  @Input() getCustomer: any;
  customer: any;
  payments: any[];
  payment;
  paymentArr;
  error = '';
  success = '';
  constructor() { }

  ngOnInit() {
  }

  addPayment(f: {
    reset: () => void;
  }) {
    this.resetErrors();

    // Update the properties in customer model with the value from standalone specific form field/s.
    this.payment.customersId = this.customer.customerId;
    this.payment.accountsId = localStorage.getItem('userId');

    // Date format for DB
    const dateValues = this.payment.paymentDate.split('-');

    this.payment.paymentDateYear = dateValues[0];
    this.payment.paymentDateMonth = dateValues[1];
    this.payment.paymentDateDay = dateValues[2];
 
    // this.salesService.store(this.sale)
    //   .subscribe((res: Sales[]) => {
    //     // Update the list of sales
    //     this.sales = res;
    //     // Inform the user
    //     this.success = 'Created successfully';
    //     // Reset the form
    //     f.reset();
    //   }, (err) => {
    //     this.error = err; 
    //     // Check if the sales data has not been added
    //     this.ref.detectChanges();
    //   });
  }
  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
