import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaymentsService, Salesref } from './_services/payments.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  loading  = false;
  submitting = false;
  
  @Input() getCustomer: any;
  customerID;
  invoiceSet;
  paymentSet;

  invoiceNo;
  dueDate;
  paidDate;
  amountPaid;
  remarks;
  
  salesref: Salesref[] = [];
  salesRef$: Observable<Salesref[]>;
  selectedSalesRef: string = null;
  error = '';
  success = '';
  
  constructor(
    private paymentsService: PaymentsService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.customerID = this.getCustomer.customerId;
    this.loadTables();
    // Sales ref filters
    /* this.salesRef$ = this.paymentsService.getSalesRef();
    this.paymentsService.getSalesRef().subscribe(salesref => {
      this.salesref = salesref;
      this.selectedSalesRef = this.salesref[0].value;
      console.log(this.selectedSalesRef);
      //this.payment.salesRef = this.selectedSalesRef;
      //console.log('Salesref prop value :: '+this.payment.salesRef);
    }); */
  }

  loadTables() {
    this.loading = true;    
    const promise = this.http.post(environment.baseUrl + '/api/payments/openinvoices.php', {customer: this.customerID}).toPromise();
    const promise2 = this.http.post(environment.baseUrl + '/api/payments/list.php', {customer: this.customerID}).toPromise();

    promise.then((res) => {
      this.invoiceSet = res;
    }, (error) => {
      console.log("Error loading Invoices");
    });

    promise2.then((res) => {
      this.paymentSet = res;
    }, (error) => {
      console.log("Error loading Payments");
    });

    Promise.all([promise, promise2]).then(res => {
      this.loading = false;
    });
  }

  get invoices() {
    if (this.invoiceSet) {
      return this.invoiceSet;
    } else {
      return [];
    }
  }

  get payments() {
    if (this.paymentSet) {
      return this.paymentSet;
    } else {
      return [];
    }
  }

  submitPayment() {
    
    this.submitting = true;

    const payload = {
      invoiceNo: this.invoiceNo,
      amountPaid: this.amountPaid,
      dueDate: this.dueDate,
      paidDate: this.paidDate,
      remarks: this.remarks
    };
    
    const promise = this.http.post(environment.baseUrl + '/api/payments/addpayment.php', payload).toPromise();
    
    promise.then((res) => {
      this.submitting = false;
      this.success = "Payment submitted";
      this.loadTables();

      this.invoiceNo = null;
      this.amountPaid = null;
      this.dueDate = null;
      this.paidDate = null;
      this.remarks  = null;
      
    }, (error) => {
      this.error = error.message;
      this.submitting = false;
    });
  }

  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
