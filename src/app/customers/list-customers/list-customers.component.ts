import { 
  Component, 
  OnInit,
  OnChanges, 
  SimpleChanges,
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
import { ListCustomers } from './list-customers';
import { ListCustomersService } from './_services/list-customers.service';
import { CustomersService } from './../_services/customers.service';

import { DataService, Country, CustomerStatus } from '../../shared/data.service';
// import { NgbDateCustomParserFormatter } from '../shared/dateformat';

import { FormControl, NgForm, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Sort } from '@angular/material';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.css']
})

export class ListCustomersComponent implements OnInit, OnChanges {

  //listCustomers: Promise<ListCustomers[]>;
  @Input() listCustomers: any = [];
  @Input() listCustomersSorted: any = [];
  @Input() getCustomer: any;
  @Output() openProfile = new EventEmitter<any>();
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
  isHeaderFifthClicked: boolean = false;
  sortDirectionFirst: boolean = true;
  sortDirectionSecond: boolean = true;
  sortDirectionThird: boolean = true;
  sortDirectionFourth: boolean = true;
  sortDirectionFifth: boolean = true;
  sortActiveFirst: boolean = false;
  sortActiveSecond: boolean = false;
  sortActiveThird: boolean = false;
  sortActiveFourth: boolean = false;
  sortActiveFifth: boolean = false;

  // Has customer data
  hasData: boolean;

  // Load profile component when a specific record has been selected
  @ViewChild('profilecontainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(
    private listCustomersService: ListCustomersService,
    private customersService: CustomersService,
    private resolver: ComponentFactoryResolver,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getCustomers();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changing on customers list...');
    console.log(changes);
    // Update list of customers once the data has been modified
    if (changes.listCustomers) {
      if (Object.prototype.toString.call(changes.listCustomers.currentValue) === '[object Object]') {
        this.getCustomers();
      }
    }
  }

  getCustomers(): void {
    this.listCustomers = this.listCustomersService.getAll().then((res: any) => {
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

    this.listCustomersSorted = data.sort((a: any, b: any) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'customerKey': return compare(a.customerKey, b.customerKey, isAsc);
          case 'businessRegNo': return compare(a.businessRegNo, b.businessRegNo, isAsc);
          case 'name': return compare(a.name, b.name, isAsc);
          case 'contactNo': return compare(a.contactNo, b.contactNo, isAsc);
          case 'status': return compare(a.status, b.status, isAsc);
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

  toggleHeaderListFifth() {
    this.isHeaderFifthClicked = !this.isHeaderFifthClicked;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
