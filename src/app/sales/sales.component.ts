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
import { BehaviorSubject } from 'rxjs';

import { AppComponent } from '../app.component';

import { Sales } from './sales';
import { Notifications } from './../notifications/notifications';

import { SalesService } from './_services/sales.service';
import { NotificationsService } from './../notifications/_services/notifications.service';
import { DataService } from '../shared/data.service';

import { NgbDatepickerConfig, NgbDateParserFormatter, NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateWholeCustomParserFormatter } from '../shared/dateformatwhole';

import { trigger, transition, animate, style, state } from '@angular/animations';

export class NgbdModalConfirmAutofocus {
  constructor(public modal: NgbActiveModal) {}
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateWholeCustomParserFormatter}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class SalesComponent implements OnChanges, OnInit {
  @Input() getCustomer: any;
  @Input() updateEvents: any;
  @Output() pushEvents: EventEmitter<any> = new EventEmitter();
  @Output() pushInvoices: EventEmitter<any> = new EventEmitter();
  customer: any;
  sales: Sales[];
  notifications: Notifications[];
  salesAry: any = [];
  salesParentId: any = [];

  // Modal properties
  modalItems: any;
  closeResult: string;

  error = '';
  success = '';
  sale = new Sales('', '', '', '', '', '', '', '', 0, '');
  notification = new Notifications('', '', '', '', '');

  // Save old data when cancel button has been clicked
  oldSalesAry: any = [];

  // For validation
  isValid: boolean = true;
  isValidEdit: boolean = true;

  // Has sales data
  hasData: boolean;

  // Edit field in table header
  rearrangeHeader: boolean;

  constructor(
    private parent: AppComponent,
    private salesService: SalesService,
    private notificationsService: NotificationsService,
    private dataService: DataService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal
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
    this.salesService.getAll(localStorage.getItem('userId'), localStorage.getItem('designation'), getCustomers.customerId).subscribe((res: Sales[]) => {
      this.salesAry = res;
      console.log(this.salesAry);
      console.log('Sales data length :: '+this.salesAry.length);
      this.salesAry.forEach((dataset: any, index: number) => {
        this.salesAry[index]['index'] = index;
        console.log(this.salesAry[index].parentId);
        // Enable edit link for respective user
        this.salesAry[index]['isEditable'] = this.dataService.accessRights(this.salesAry[index], 'sales', 86400000) ? true : false;  
        console.log('Can edit :: '+this.salesAry[index]['isEditable']);
        // Make all sales non-editable by default
        this.rearrangeHeader = false;
        this.salesAry[index]['editNow'] = false;
        this.salesAry[index]['isUpdated'] = false;
        // Set update datetime as empty by default
        this.salesAry[index]['updateDateTime'] = '';
        // Save old data when cancel button has been clicked
        this.oldSalesAry.push({
            'paymentDate': this.salesAry[index].paymentDate,
            'amount': this.salesAry[index].amount,
            'invoices': this.salesAry[index].invoices
          });
        this.ref.detectChanges();
      });
      // No records found when there is/are no data fetched
      console.log(this.salesAry.length);
      this.hasData = this.salesAry.length > 0 ? true : false;
      console.log(this.hasData);
      // Check if the sales data has been fetched
      this.ref.detectChanges();
    }, (err) => {
      this.error = err;
    });
  }

  addSales(f: {
    reset: () => void;
  }, event: Event) {
    this.resetErrors();
    // Fields checker
    let regInvoices = RegExp('^[a-zA-Z0-9]+$', 'i');
    event.preventDefault();
    // Validation rules
    const invalidFields = !this.sale.invoices || !regInvoices.test(this.sale.invoices) || !this.sale.amount || !this.sale.paymentDate;
    if (invalidFields) {
      this.isValid = false;
    } else {
      this.isValid = true;
      // Update the properties in customer model with the value from standalone specific form field/s.
      this.sale.customersId = this.customer.customerId;
      this.sale.accountsId = localStorage.getItem('userId');
      this.sale.parentId = Number(localStorage.getItem('userParentId'));

      // Date format for DB
      const dateValues = this.sale.paymentDate.split('-');

      this.sale.paymentDateYear = dateValues[0];
      this.sale.paymentDateMonth = dateValues[1];
      this.sale.paymentDateDay = dateValues[2];
  
      this.salesService.store(this.sale)
        .subscribe((res: Sales[]) => {
          // Update the list of sales
          this.sales = res;
          console.log(this.sales);
          this.sales.forEach((dataset: any, index: number) => {
            this.sales[index]['index'] = index;
            console.log('New index is '+this.sales[index]['index']);
            this.sales[index]['isEditable'] = this.dataService.accessRights(this.salesAry[index], 'sales', 86400000) ? true : false;  
            console.log('New Can edit :: '+this.sales[index]['isEditable']);
            // Make all sales non-editable by default
            this.rearrangeHeader = false;
            this.sales[index]['editNow'] = false;
            this.sales[index]['isUpdated'] = false;
          });
          // Update invoices list in the drop down on payments form
          this.pushInvoices.emit(this.sales[0].invoices);
          // Inform the user
          this.success = 'Created successfully';
          this.hasData = true;
          // Log data changes on events
          this.addEvents(this.notification, this.sales, 'New Sales', 'created');
          // Reset the form
          f.reset();
        }, (err) => {
          this.error = err; 
          // Check if the sales data has not been added
          this.ref.detectChanges();
        });
    }
    
  }

  editSales(event: any, item: any, isEditable: boolean) {
    event.stopPropagation();
    if (isEditable) {
      console.log(item);
      item.editNow = isEditable;
      this.rearrangeHeader = true;
      this.ref.detectChanges();
    }
  }

  cancelSales(event: any, item: any) {
    event.stopPropagation();
    console.log(this.oldSalesAry);
    item.editNow = false;
    this.rearrangeHeader = false;
    this.oldSalesAry.forEach((dataset: any, index: number) => {
      if (item.paymentDate !== this.oldSalesAry[index].paymentDate && typeof this.salesAry[index] !== 'undefined') {
        this.salesAry[index].paymentDate = this.oldSalesAry[index].paymentDate;
      }
      if (item.amount !== this.oldSalesAry[index].amount && typeof this.salesAry[index] !== 'undefined') {
        this.salesAry[index].amount = this.oldSalesAry[index].amount;
      }
      if (item.invoices !== this.oldSalesAry[index].invoices && typeof this.salesAry[index] !== 'undefined') {
        this.salesAry[index].invoices = this.oldSalesAry[index].invoices;
      }
    });
    this.ref.detectChanges();
  }

  updateSales(event: any, item: any) {
    event.stopPropagation();
    // Fields checker
    let regInvoices = RegExp('^[a-zA-Z0-9]+$', 'i');
    // Validation rules
    const invalidFields = !item.invoices || !regInvoices.test(item.invoices) || !item.amount || !item.paymentDate;
    if (invalidFields) {
      this.isValidEdit = false;
    } else {
      this.isValidEdit = true;
      // Get current sales ID
      item['salesId'] = item.id;

      // Date format for DB
      const dateValues = item.paymentDate.split('-');
      item['paymentDateYear'] = dateValues[0];
      item['paymentDateMonth'] = dateValues[1];
      item['paymentDateDay'] = dateValues[2];
      
      this.salesService.update(item)
        .subscribe((res: Sales[]) => {
          // Update the list of sales
          this.sales = res;
          console.log(this.sales);
          console.log(item);
          item.updateDateTime = this.sales[this.sales.length-1]['updateDateTime'];
          // Inform the user
          this.success = 'The invoice number '+item.invoices+' has been updated successfully';
          this.rearrangeHeader = false;
          item.editNow = false;
          // Remove old data from a specific selected sales
          this.sales.splice(this.sales.length-1, 1);
          console.log(this.sales);
          // Update invoices list in the drop down on payments form
          this.salesService.updatedInvoices(this.sales);
          this.ref.detectChanges();
        }, (err) => {
          this.error = err; 
          // Check if the sales data has not been added
          this.ref.detectChanges();
        });
    }
    
  }

  deleteSales(item: any, result: any) {
    // Get current sales ID
    item['salesId'] = item.id;

    this.salesService.delete(item)
      .subscribe((res: Sales[]) => {
        // Update the list of sales
        this.sales = res;
        console.log(this.sales);
        console.log(item);
        item.updateDateTime = this.sales[this.sales.length-1]['updateDateTime'];
        console.log('Delete update time :: '+item.updateDateTime);
        // Inform the user
        this.success = 'The invoice number '+item.invoices+' has been deleted successfully';
        this.rearrangeHeader = false;
        item.editNow = false;
        // Remove old data from a specific selected sales
        this.sales.splice(this.sales.length-1, 1);
        
        //Remove selected data
        this.sales.forEach((dataset: any, index: number) => {
          console.log('index is '+index);
          console.log('Re-index :: '+item.index+' === '+this.sales[index]['index']);
          if (item.index === index) {
            this.sales.splice(index, 1);
            if (typeof this.sales[index] !== 'undefined') {
              console.log('Replacing index :: '+this.sales[index]['index']);
              this.sales[index]['index'] = index;
            }
          } else {
            console.log('Append index :: '+index);
            this.sales[index]['index'] = index;
          } 
        });
        
        
        console.log(this.sales);
        // Update invoices list in the drop down on payments form
        this.salesService.updatedInvoices(this.sales);
        this.ref.detectChanges();
      }, (err) => {
        this.error = err; 
        // Check if the sales data has not been added
        this.ref.detectChanges();
      });

    console.log('selected modal item :: '+item.invoices);
    this.closeResult = `Closed with: ${result}`;
  }

  addEvents(notification: any, sales: any, eventType: string, status: string) {
    // Differiate descriptions depends on status
    switch (status) {
      case 'created':
        // Get the current customer name and add it on the sales data as property
        sales.forEach((dataset: any, index: number) => {
          sales[index]['customerName'] = this.parent.convertCase(this.getCustomer.name);
        });
        // Get the newly created sales
        let sale = sales[0];
        console.log(sale);
        notification.eventType = eventType;
        notification.description = '<strong>'+this.parent.convertCase(localStorage.getItem('currentUser'))+'</strong> created a sale for <strong>'+sale.customerName+'</strong>.';
        notification.createDateTime = sale.createDateTime;
      break;
      case 'updated':
        // Get the current customer name and add it on the sales data as property
        sales['customerName'] = this.parent.convertCase(this.getCustomer.name);
        
        notification.eventType = eventType;
        notification.description = '<strong>'+this.parent.convertCase(localStorage.getItem('currentUser'))+'</strong> have completely updated the sales for <strong>'+sales.customerName+'</strong>.';
        notification.updateDateTime = sales.updateDateTime;
        notification.createDateTime = '';
      break;
      case 'deleted':
        // Get the current customer name and add it on the sales data as property
        sales['customerName'] = this.parent.convertCase(this.getCustomer.name);
        
        notification.eventType = eventType;
        notification.description = '<strong>'+this.parent.convertCase(localStorage.getItem('currentUser'))+'</strong> have completely deleted the sales for <strong>'+sales.customerName+'</strong>.';
        notification.updateDateTime = sales.updateDateTime;
        notification.isDeleted = 1;
        notification.createDateTime = '';
      break;
    }
    console.log(this.notification);

    this.notificationsService.store(this.notification)
      .subscribe((res: Notifications[]) => {
        // Update the list of sales
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
        // Check if the sales data has not been added
        this.ref.detectChanges();
      });
  }

  /**
   * Modal - Delete sales
   * @param item 
   */
  confirmDeleteSales(content: any, item: any, isEditable: boolean) {
    if (isEditable) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.deleteSales(item, result);
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
