import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersComponent } from './../customers/customers.component';
import { HeaderComponent } from './../header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Input() newTitle: string = '';
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

  ngOnInit() {}

  displayCustomerTitle(title: string = null) {
    this.newTitle = title;
    console.log('New title :: '+title);
    return title;
  }

}
