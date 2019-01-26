import { Component, OnInit, ChangeDetectionStrategy, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersComponent } from '../customers/customers.component';
import { HeaderComponent } from '../header/header.component';

import { DataService } from './../shared/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  
  @Input() newTitle: string = '';
  @Output() getUpdatedCustomerTitle: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private dataService: DataService,
    private headerComponent: HeaderComponent
  ) { }

  openFormModal() {
    const modalRef = this.modalService.open(CustomersComponent);


    /*
    We may want to pass an id to the modal-component. This is achieved by adding
    the following line inside the openFormModal method.
    */
    modalRef.componentInstance.id = 10; // should be the id

    /* Notice how we interact with the model via a promise.
    */
    modalRef.result.then((result) => {
      console.log('form result >>');
      console.log(result);
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }

  ngOnInit() {
  }

  changeTitleCustomers(headerTitle: string) {
    this.getUpdatedCustomerTitle.subscribe((title: string) => this.changeTitle(title));
    this.getUpdatedCustomerTitle.emit(headerTitle);
  }

  changeTitle(title: string) {
    this.newTitle = title;
  }

}
