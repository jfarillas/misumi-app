import { 
  Component, 
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppComponent } from '../app.component';

import { SalesService } from './../sales/_services/sales.service';
import { PaymentsService, Salesref } from './_services/payments.service';
import { NotificationsService } from './../notifications/_services/notifications.service';
import { DataService } from '../shared/data.service';

import { Notifications } from './../notifications/notifications';

import { NgbDatepickerConfig, NgbDateParserFormatter, NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateWholeCustomParserFormatter } from '../shared/dateformatwhole';
import { trigger, transition, animate, style, state } from '@angular/animations';

export class NgbdModalConfirmAutofocus {
  constructor(public modal: NgbActiveModal) {}
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateWholeCustomParserFormatter}
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('500ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        style({'transform-origin': 'top'}),
        animate('500ms ease-out', style({transform: 'scaleY(0)'}))
      ])
    ])
  ]
})
export class PaymentsComponent implements OnInit, OnChanges {
  loading  = false;
  submitting = false;
  
  @Input() getCustomer: any;
  @Input() getItem: any;
  @Input() updateEvents: any;
  @Input() updateInvoices: any;
  @Input() updateTotalPayment: any;
  @Output() pushEvents: EventEmitter<any> = new EventEmitter();
  @Output() pushTotalPayments: EventEmitter<any> = new EventEmitter();

  // IDs
  customerID;
  parentID;
  
  // Collections
  invoiceSet;
  invoicesChanged;
  paymentSet;

  // Add fields
  invoiceNo;
  dueDate;
  paidDate;
  amountPaid;
  remarks;
  createdBy;
  salesDate: any;
  refSalesDate: any;

  // Edit fields
  updatedBy;

  notifications: Notifications[];
  notification = new Notifications('', '', '', '', '');

  // Save old data when cancel button has been clicked
  oldPaymentSet: any = [];

  // For validation
  isValid: boolean = true;
  isValidEdit: boolean = true;
  isValidDueDate: boolean;
  isValidDueDateEdit: boolean;

  // Callback data
  callbackData: any;

  // Has payment data
  hasData: boolean;

  // Invoices have been changed
  invoicesUpdated: boolean;

  // Modal properties
  modalItems: any;
  closeResult: string;
  
  salesref: Salesref[] = [];
  salesRef$: Observable<Salesref[]>;
  selectedSalesRef: string = null;
  error = '';
  success = '';

  // Edit field in table header
  rearrangeHeader: boolean;
  
  constructor(
    private parent: AppComponent,
    private paymentsService: PaymentsService,
    private http: HttpClient,
    private salesService: SalesService,
    private notificationsService: NotificationsService,
    private dataService: DataService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.customerID = this.getCustomerId();
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

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changing on Payments...');
    console.log(changes);
    // Update list of invoices onces create a new data
    if (changes.updateInvoices) {
      if (this.invoiceSet && changes.updateInvoices.currentValue) {
        this.invoiceSet.unshift({invoiceNo: changes.updateInvoices.currentValue});
        this.invoicesChanged = this.invoiceSet;
        this.invoicesUpdated = true;
        console.log("Fetching newly invoices...");
      } else {
        this.invoicesUpdated = false;
      }
    }
    // Update list of invoices once modify the data
    this.salesService.changeEmitted$.subscribe(data => {
      if (data.length > 0) {
        console.log("Fetching updated invoices...");
        let invoicesAry = [];
        data.forEach((dataset: any, index: number) => {
          if (data[index].invoices) {
            invoicesAry.push({invoiceNo: data[index].invoices});
          } else {
            // Get all invoices when the page loads
            invoicesAry.push({invoiceNo: data[index].invoiceNo});
          }
        });
        console.log(invoicesAry);
        this.invoicesChanged = invoicesAry;
        this.invoicesUpdated = true;
      } else {
        let invoicesAry = [];
        console.log(invoicesAry);
        this.invoicesChanged = invoicesAry;
        this.invoicesUpdated = true;
      }
    });
    console.log(this.invoices);
    //this.updateInvoices = changes.getCustomer.currentValue;
  }

  getCustomerId() {
    if (this.getCustomer) {
      return this.getCustomer.customerId;
    } else if (this.getItem) {
      return this.getItem.customerId;
    }
  }

  getCustomerName() {
    if (this.getCustomer) {
      return this.getCustomer.name;
    } else if (this.getItem) {
      return this.getItem.name;
    }
  }

  loadTables() {
    this.loading = true;    
    const promise = this.http.post(environment.baseUrl + '/api/payments/openinvoices.php', {userId: localStorage.getItem('userId'), customer: this.customerID}).toPromise();
    const promise2 = this.http.post(environment.baseUrl + '/api/payments/list.php', {userId: localStorage.getItem('userId'), customer: this.customerID}).toPromise();

    promise.then((res) => {
      if (res) {
        console.log(res);
        this.invoiceSet = res;
        // Update invoices list in the drop down on payments form
        this.salesService.updatedInvoices(this.invoiceSet)
      } else {
        this.invoiceSet = []
      }
      console.log(this.invoiceSet);
    }, (error) => {
      console.log("Error loading Invoices");
    });

    promise2.then((res) => {
      if (res) {
        this.paymentSet = res;
        this.paymentSet.forEach((dataset: any, index: number) => {
          this.paymentSet[index]['index'] = index;
          console.log(this.paymentSet[index].parentid);
          // Enable edit link for respective user
          this.paymentSet[index]['isEditable'] = true;
          //this.paymentSet[index]['isEditable'] = this.dataService.accessRights(this.paymentSet[index], 'payments', 86400000) ? true : false;  
          console.log('Can edit :: '+this.paymentSet[index]['isEditable']);
          // Make all payments non-editable by default
          this.rearrangeHeader = false;
          this.paymentSet[index]['editNow'] = false;
          this.paymentSet[index]['isUpdated'] = false;
          // Set update datetime as empty by default
          this.paymentSet[index]['updateDateTime'] = '';
          // Save old data when cancel button has been clicked
          this.oldPaymentSet.push({
            'duedate': this.paymentSet[index].duedate,
            'paiddate': this.paymentSet[index].paiddate,
            'amount': this.paymentSet[index].amount,
            'invoicekey': this.paymentSet[index].invoicekey,
            'remarks': this.paymentSet[index].remarks
          });
          this.ref.detectChanges();
        });
        this.hasData = true;
      } else {
        // No records found when there is/are no data fetched
        this.paymentSet = [];
        this.hasData = false;
      }
      console.log(this.paymentSet);
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

  selectedSalesDate(item: any) {
    const promise = this.http.post(environment.baseUrl + '/api/payments/salesdate.php', {invoicekey: item, customer: this.getCustomerId()}).toPromise();

    promise.then((res) => {
      if (res) {
        this.salesDate = res;
        this.salesDate.forEach((dataset: any, index: any) => {
          console.log(this.salesDate[index]);
          this.refSalesDate = this.salesDate[index].paymentDate;
          console.log('Sales date :: '+this.refSalesDate);
          console.log('Due date :: '+this.dueDate);
        });
      } else {
        this.salesDate = [];
      }
    }, (error) => {
      console.log("Error loading Sales Date");
    });
  }

  validateDueDate(dueDate: any, salesDate: any, action: string) {
     // Validation rules
     switch (action) {
       case 'store':
        this.isValid = false;
        const salesDateInvalid = new Date(this.refSalesDate) >= new Date(dueDate) && !this.isValid;
        if (salesDateInvalid) {
          console.log(this.refSalesDate+'>='+dueDate);
          this.submitting = false;
          this.isValidDueDate = false;
          event.stopPropagation();
        } else {
          this.isValid = true;
        }
       break;
       case 'update':
        this.isValidEdit = false;
        const salesDateInvalidEdit = new Date(salesDate) >= new Date(dueDate) && !this.isValidEdit;
        if (salesDateInvalidEdit) {
          console.log(this.refSalesDate+'>='+dueDate);
          this.submitting = false;
          this.isValidDueDateEdit = false;
          event.stopPropagation();
        } else {
          this.isValidEdit = true;
        }
       break;
     }
    
  }

  submitPayment(event: Event) {
    
    this.submitting = true;

    // Validation rules
    this.isValid = false;
    let parentIDInvalid = localStorage.getItem('userParentId') === '';
    const dateDueInvalid = !this.dueDate && !this.isValid;
    const invoiceAmountInvalid = !this.amountPaid && !this.isValid;
    const invoiceNoInvalid = !this.invoiceNo && !this.isValid;
    const salesDateInvalid = new Date(this.refSalesDate) >= new Date(this.dueDate) && !this.isValid;
    if (dateDueInvalid || invoiceAmountInvalid || invoiceNoInvalid || parentIDInvalid || salesDateInvalid) {
      console.log('required');
      this.submitting = false;
      this.isValidDueDate = false;
      event.stopPropagation();
    } else {
      this.isValid = true;
      this.parentID = Number(localStorage.getItem('userParentId'));
      this.createdBy = localStorage.getItem('currentUser')+' ('+this.parent.convertCase(localStorage.getItem('designation'))+')';
      const payload = {
        customerId: this.getCustomerId(),
        parentId: this.parentID,
        invoiceNo: this.invoiceNo,
        amountPaid: this.amountPaid,
        dueDate: this.dueDate,
        paidDate: this.paidDate,
        remarks: this.remarks,
        createdBy: this.createdBy
      };
      this.cudPayment(environment.baseUrl + '/api/payments/addpayment.php', payload, 'store');
      
    }
    if (!salesDateInvalid) {
      this.isValidDueDate = true;
    }
  }

  editPayment(event: Event, item: any, isEditable: boolean) {
    event.stopPropagation();
    if (isEditable) {
      console.log(item);
      item.editNow = isEditable;
      this.rearrangeHeader = true;
      this.ref.detectChanges();
    }
  }

  cancelPayment(event: Event, item: any) {
    event.stopPropagation();
    item.editNow = false;
    this.rearrangeHeader = false;
    this.oldPaymentSet.forEach((dataset: any, index: number) => {
      if (item.duedate !== this.oldPaymentSet[index].duedate && typeof this.paymentSet[index] !== 'undefined') {
        this.paymentSet[index].duedate = this.oldPaymentSet[index].duedate;
      }
      if (item.amount !== this.oldPaymentSet[index].amount && typeof this.paymentSet[index] !== 'undefined') {
        this.paymentSet[index].amount = this.oldPaymentSet[index].amount;
      }
      if (item.paiddate !== this.oldPaymentSet[index].paiddate && typeof this.paymentSet[index] !== 'undefined') {
        this.paymentSet[index].paiddate = this.oldPaymentSet[index].paiddate;
      }
      if (item.invoicekey !== this.oldPaymentSet[index].invoicekey && typeof this.paymentSet[index] !== 'undefined') {
        this.paymentSet[index].invoicekey = this.oldPaymentSet[index].invoicekey;
      }
      if (item.remarks !== this.oldPaymentSet[index].remarks && typeof this.paymentSet[index] !== 'undefined') {
        this.paymentSet[index].remarks = this.oldPaymentSet[index].remarks;
      }
    });
    this.loadTables();
    this.ref.detectChanges();
  }

  updatePayment(event: Event, item: any) {
    event.stopPropagation();
    // Validation rules
    this.isValidEdit = false;
    let parentIDInvalid = localStorage.getItem('userParentId') === '';
    const invoicekeyInvalid = !item.invoicekey && !this.isValidEdit;
    const amountInvalid = !item.amount && !this.isValidEdit;
    const duedateInvalid = !item.duedate && !this.isValidEdit;
    const salesDateInvalid = new Date(item.payment_date) >= new Date(item.duedate) && !this.isValidEdit;
    if (invoicekeyInvalid || amountInvalid || duedateInvalid || parentIDInvalid || salesDateInvalid) {
      console.log('required');
      this.submitting = false;
      this.isValidDueDateEdit = false;
      event.stopPropagation();
    } else {
      this.isValidEdit = true;
      this.parentID = Number(localStorage.getItem('userParentId'));
      this.updatedBy = localStorage.getItem('currentUser')+' ('+this.parent.convertCase(localStorage.getItem('designation'))+')';
      const payload = {
        paymentId: item.id,
        customerId: this.getCustomerId(),
        parentId: this.parentID,
        invoiceNo: item.invoicekey,
        amountPaid: item.amount,
        dueDate: item.duedate,
        paidDate: item.paiddate,
        remarks: item.remarks,
        updatedBy: this.updatedBy
      };
      this.cudPayment(environment.baseUrl + '/api/payments/update.php', payload, 'update');
    }
    if (!salesDateInvalid) {
      this.isValidDueDateEdit = true;
    }
  }

  deletePayment(item: any, result: any) {
    // Get current payments ID if not undefined, null or NaN
    if (typeof item.id !== 'undefined' || item.id !== null || !isNaN(Number(item.id))) {
      this.updatedBy = localStorage.getItem('currentUser')+' ('+this.parent.convertCase(localStorage.getItem('designation'))+')';
      const payload = {
        paymentId: item.id,
        updatedBy: this.updatedBy
      };
      this.cudPayment(environment.baseUrl + '/api/payments/delete.php', payload, 'delete');
      
    } else {
      console.log('Invalid ID');
      event.stopPropagation();
      this.submitting = false;
    }
    this.closeResult = `Closed with: ${result}`;
  }

  cudPayment(uri: string, payload: any, action: string) {
    if (action === 'store' || action === 'update') {
      // Assign default values for those non-compulsory fields
      // For date/datetime, an empty/all zero based values are not allowed 
      const undefinedDatePaid = typeof payload.paidDate === 'undefined' || payload.paidDate === null;
      const undefinedRemarks = typeof payload.remarks === 'undefined' || payload.remarks === null;
      payload.paidDate = (undefinedDatePaid) ? '1000-01-01' : payload.paidDate; // Default value - 1000-01-01
      payload.remarks = (undefinedRemarks) ? '' : payload.remarks;
      console.log(payload.paidDate);
      console.log(payload.remarks);
    }
    
    console.log(payload);
    /* let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }; */
    switch (action) {
      case 'store':
        const promiseStore = this.http.post(uri, payload).toPromise();
        promiseStore.then((res) => {
          this.dataResponse(res, 'Payment submitted', 'store');
        }, (error) => {
          this.error = error.message;
          this.submitting = false;
        });
      break;
      case 'update':
        const promiseUpdate = this.http.post(uri, payload, {responseType: 'text'}).toPromise();
        promiseUpdate.then((res) => {
          const objRes = JSON.parse(res);
          this.dataResponse(objRes, 'Payment updated', 'update');
        }, (error) => {
          this.error = error.message;
          this.submitting = false;
        });
      break;
      case 'delete':
        const promiseDelete = this.http.post(uri, payload, {responseType: 'text'}).toPromise();
        promiseDelete.then((res) => {
          const objRes = JSON.parse(res);
          this.dataResponse(objRes, 'Payment deleted', 'delete');
        }, (error) => {
          this.error = error.message;
          this.submitting = false;
        });
        
      break;
    }
  }

  dataResponse(res: any, notifText: string, action: string) {
    console.log(res);
    if (action === 'store') {
      this.isValid = true;
    } else if (action === 'update' || action === 'delete') {
      this.isValidEdit = true;
    }
    this.submitting = false;
    this.success = notifText;
    this.loadTables();

    this.invoiceNo = null;
    this.amountPaid = null;
    this.dueDate = null;
    this.paidDate = null;
    this.remarks  = null;

    this.paymentSet = res;
    
    // Update total sales chart on profile tab
    this.pushTotalPayments.emit(res);
  }

  addEvents(notification: any, payments: any, eventType: string, status: string) {
    const paymentAry = []
    // Differiate descriptions depends on status
    switch (status) {
      case 'created':
        for (var i=0;i<Object.keys(payments).length;i++) {
          paymentAry['createDateTime'] = payments.createDateTime;
        }
        // Get the newly created payments
        notification.eventType = eventType;
        notification.description = '<strong>'+this.parent.convertCase(localStorage.getItem('currentUser'))+'</strong> have completely created the payments for <strong>'+this.parent.convertCase(this.getCustomerName())+'</strong>.';
        notification.createDateTime = paymentAry['createDateTime'];
      break;
      case 'updated':
        notification.eventType = eventType;
        notification.description = '<strong>'+this.parent.convertCase(localStorage.getItem('currentUser'))+'</strong> have completely updated the payments for <strong>'+this.parent.convertCase(this.getCustomerName())+'</strong>.';
        notification.updateDateTime = payments.updateDateTime;
        notification.createDateTime = '';
      break;
      case 'deleted':
        notification.eventType = eventType;
        notification.description = '<strong>'+this.parent.convertCase(localStorage.getItem('currentUser'))+'</strong> have completely deleted the payments for <strong>'+this.parent.convertCase(this.getCustomerName())+'</strong>.';
        notification.updateDateTime = payments.updateDateTime;
        notification.createDateTime = '';
      break;
    }
    console.log(this.notification);

    this.notificationsService.store(this.notification)
      .subscribe((res: Notifications[]) => {
        // Update the list of payments
        this.notifications = res;
        // Update the notification panel with latest data
        console.log(res);
        this.updateEvents = res;
        console.log("Emitting notifications...");
        console.log(this.updateEvents);
        this.pushEvents.emit(this.updateEvents);
        //this.salesService.updatedEvents(Object.entries(res));
        // console.log(this.salesService.getUpdatedEvents());
      }, (err) => {
        this.error = err; 
        // Check if the payments data has not been added
        this.ref.detectChanges();
      });
  }

  /**
   * Modal - Delete payments
   * @param item 
   */
  confirmDeletePayment(content: any, item: any, isEditable: boolean) {
    if (isEditable) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.deletePayment(item, result);
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.modalItems = item.invoices;
      console.log('Open modal item :: '+this.modalItems);
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
