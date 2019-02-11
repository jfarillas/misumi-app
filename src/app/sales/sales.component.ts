import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
  ChangeDetectionStrategy
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
  constructor(private salesService: SalesService) {
  }
  ngOnInit() {
    console.log("init");
    this.getSales();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changing");
    this.customer = changes.getCustomer.currentValue;
  }
  getSales(): void {
    this.salesService.getAll().subscribe((res: Sales[]) => {
      this.salesArr = res;
      console.log(this.salesArr);
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
    const registrationDateFormat: object = Object.values(this.sale.paymentDate);
    const regYearDateFormat: string = registrationDateFormat[0];
    const regMonthDateFormat: string = (registrationDateFormat[1] < 10) ? '0' + registrationDateFormat[1] : registrationDateFormat[1];
    const regDayDateFormat: string = (registrationDateFormat[2] < 10) ? '0' + registrationDateFormat[2] : registrationDateFormat[2];
    console.log(regYearDateFormat + '-' + regMonthDateFormat + '-' + regDayDateFormat);
    this.sale.paymentDateYear = regYearDateFormat;
    this.sale.paymentDateMonth = regMonthDateFormat;
    this.sale.paymentDateDay = regDayDateFormat;

    this.salesService.store(this.sale)
      .subscribe((res: Sales[]) => {
        // Update the list of sales
        this.sales = res;
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
