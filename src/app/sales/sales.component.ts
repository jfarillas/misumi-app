import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Sales } from './sales';
import { SalesService } from './_services/sales.service';

import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateWholeCustomParserFormatter } from '../shared/dateformatwhole';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateWholeCustomParserFormatter}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesComponent implements OnChanges, OnInit {
  @Input() getCustomer: any;
  customer: any;
  sales: Sales[];
  salesArr: any = [];
  error = '';
  success = '';
  sale = new Sales('', '', '', '', '', '', '', '', 0);

  // Has sales data
  hasData: boolean;

  constructor(
    private salesService: SalesService,
    private ref: ChangeDetectorRef
  ) {
  }
  ngOnInit() {
    console.log("init");
    this.getSales(this.getCustomer);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changing");
    this.customer = changes.getCustomer.currentValue;
  }
  getSales(getCustomers: any): void {
    console.log(getCustomers.customerId);
    this.salesService.getAll(getCustomers.customerId).subscribe((res: Sales[]) => {
      this.salesArr = res;
      // No records found when there is/are no data fetched
      console.log(this.salesArr.length);
      this.hasData = this.salesArr.length > 0 ? true : false;
      console.log(this.hasData);
      // Check if the sales data has been fetched
      this.ref.detectChanges();
    }, (err) => {
      this.error = err;
    });
  }
  addSales(f: {
    reset: () => void;
  }) {
    this.resetErrors();

    // Update the properties in customer model with the value from standalone specific form field/s.
    this.sale.customersId = this.customer.customerId;
    this.sale.accountsId = localStorage.getItem('userId');

    // Date format for DB
    const dateValues = this.sale.paymentDate.split('-');

    this.sale.paymentDateYear = dateValues[0];
    this.sale.paymentDateMonth = dateValues[1];
    this.sale.paymentDateDay = dateValues[2];
 
    this.salesService.store(this.sale)
      .subscribe((res: Sales[]) => {
        // Update the list of sales
        this.sales = res;
        // Inform the user
        this.success = 'Created successfully';
        this.hasData = true;
        // Reset the form
        f.reset();
      }, (err) => {
        this.error = err; 
        // Check if the sales data has not been added
        this.ref.detectChanges();
      });
  }
  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
