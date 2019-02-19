import { Component, OnInit, Input } from '@angular/core';
import { PaymentsService, Salesref } from './_services/payments.service';

import { Observable } from 'rxjs';

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
  salesref: Salesref[] = [];
  salesRef$: Observable<Salesref[]>;
  selectedSalesRef: string = null;
  error = '';
  success = '';
  constructor(
    private paymentsService: PaymentsService
  ) { }

  ngOnInit() {
    // Sales ref filters
    this.salesRef$ = this.paymentsService.getSalesRef();
    this.paymentsService.getSalesRef().subscribe(salesref => {
      this.salesref = salesref;
      this.selectedSalesRef = this.salesref[0].value;
      console.log(this.selectedSalesRef);
      //this.payment.salesRef = this.selectedSalesRef;
      //console.log('Salesref prop value :: '+this.payment.salesRef);
    });
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
