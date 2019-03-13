import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersComponent } from './../customers/customers.component';
import { HeaderComponent } from './../header/header.component';

import { Notifications } from './../notifications/notifications';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Input() newTitle: string = '';
  @Input() updateEvents: any;
  @Output() pushEvents: EventEmitter<any> = new EventEmitter();
  userName = localStorage.getItem('currentUser');

  constructor(
    private modalService: NgbModal,
    private headerComponent: HeaderComponent,
    private router: Router
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
    this.router.navigate(['/customers']);
  }

  displayCustomerTitle(title: string = null) {
    this.newTitle = title;
    console.log('New title :: '+title);
    return title;
  }

  pushUpdatedEvents(notifications: any) {
    this.updateEvents = notifications;
    console.log('Home latest notifications...');
    console.log(this.updateEvents);
    //this.pushEvents.emit(this.updateEvents)
    return notifications;
  }
}
