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
  EventEmitter
} from '@angular/core';
import { ListCustomers } from './list-customers';
import { ListCustomersService } from './_services/list-customers.service';

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

export class ListCustomersComponent implements OnInit {

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

  // Load profile component when a specific record has been selected
  @ViewChild('profilecontainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(
    private listCustomersService: ListCustomersService,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers(): void {
    this.listCustomers = this.listCustomersService.getAll().then((res: any) => {
      console.log(res);
      // Sorting data
      this.sortedData = res;
      //return customersArr;
      return res;
    }, (err) => {
      this.error = err;
    });
  }

  sortData(sort: Sort, sortedData: any) {
    switch (sort.active) {
      case 'customerKey': 
        this.sortDirectionFirst = sort.direction != '' ? true : false; 
        this.sortActiveFirst = true;
      break;
      case 'businessRegNo': 
        this.sortDirectionSecond = sort.direction != '' ? true : false; 
        this.sortActiveSecond = true;
      break;
      case 'name': 
        this.sortDirectionThird = sort.direction != '' ? true : false; 
        this.sortActiveThird = true;
      break;
      case 'contactNo': 
        this.sortDirectionFourth = sort.direction != '' ? true : false; 
        this.sortActiveFourth = true;
      break;
      case 'status': 
        this.sortDirectionFifth = sort.direction != '' ? true : false; 
        this.sortActiveFifth = true;
      break;
    }
    
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

  // Get the customer data to carry over on profile tab
  showCustomerProfile(customer: any) {
    this.openProfile.subscribe((data: any) => this.customerProfile(data));
    this.openProfile.emit(customer);
  }

  customerProfile(data: any) {
    this.getCustomer = data;
    console.log('from list customer...');
    console.log(this.getCustomer);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}