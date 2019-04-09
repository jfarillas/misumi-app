import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy, 
  ViewChild, 
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';

import { OverdueInvoicesService } from './_services/overdue-invoices.service';
import { Sort } from '@angular/material';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-overdue-invoices',
  templateUrl: './overdue-invoices.component.html',
  styleUrls: ['./overdue-invoices.component.css']
})
export class OverdueInvoicesComponent implements OnInit {

  @Input() sales: any = [];
  @Input() salesSorted: any = [];
  @Input() getItem: any;
  @Output() openPayment = new EventEmitter<any>();
  error = '';
  success = '';

  // Sorting data initialisation
  data: any = [];
  sortedData: any = [];
  isSorted: boolean = false;
  isHeaderFirstClicked: boolean = false;
  isHeaderSecondClicked: boolean = false;
  isHeaderThirdClicked: boolean = false;
  isHeaderFourthClicked: boolean = false;
  sortDirectionFirst: boolean = true;
  sortDirectionSecond: boolean = true;
  sortDirectionThird: boolean = true;
  sortDirectionFourth: boolean = true;
  sortActiveFirst: boolean = false;
  sortActiveSecond: boolean = false;
  sortActiveThird: boolean = false;
  sortActiveFourth: boolean = false;

  // Has customer data
  hasData: boolean;

  constructor( private overdueInvoicesService: OverdueInvoicesService) { }

  ngOnInit() {
    this.getSales();
  }

  getSales(): void {
    this.sales = this.overdueInvoicesService.getAll(Number(localStorage.getItem('userId'))).then((res: any) => {
      console.log(res);
      // Sorting data
      this.sortedData = res;
      // No records found when there is/are no data fetched
      console.log(res.length);
      this.hasData = res.length > 0 ? true : false;
      console.log(this.hasData);
      //return customersArr;
      return res;
    }, (err) => {
      this.error = err;
    });
  }

  sortData(sort: Sort, sortedData: any) {
    const data = sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    // Check if sorted
    this.isSorted = true;

    this.salesSorted = data.sort((a: any, b: any) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name': return compare(a.name, b.name, isAsc);
          case 'paymentDate': return compare(new Date(a.paymentDate), new Date(b.paymentDate), isAsc);
          case 'amount': return compare(a.amount, b.amount, isAsc);
          case 'invoiceNo': return compare(a.invoiceNo, b.invoiceNo, isAsc);
          default: return 0;
        }
      });
  }

  toggleHeaderListFirst() {
    this.isHeaderFirstClicked = !this.isHeaderFirstClicked;
  }

  toggleHeaderListSecond() {
    this.isHeaderSecondClicked = !this.isHeaderSecondClicked;
  }

  toggleHeaderListThird() {
    this.isHeaderThirdClicked = !this.isHeaderThirdClicked;
  }

  toggleHeaderListFourth() {
    this.isHeaderFourthClicked = !this.isHeaderFourthClicked;
  }

}

function compare(a: any, b: any, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
