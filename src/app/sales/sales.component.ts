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
  @Input() updateEvents: any;
  @Output() pushEvents: EventEmitter<any> = new EventEmitter();
  customer: any;
  sales: Sales[];
  notifications: Notifications[];
  salesAry: any = [];
  salesParentId: any = [];
  error = '';
  success = '';
  sale = new Sales('', '', '', '', '', '', '', '', '');
  notification = new Notifications('', '', '', '', '');

  // Has sales data
  hasData: boolean;

  // Edit field in table header
  rearrangeHeader: boolean;

  constructor(
    private parent: AppComponent,
    private salesService: SalesService,
    private notificationsService: NotificationsService,
    private ref: ChangeDetectorRef
  ) {
  }
  ngOnInit() {
    console.log("init");
    this.getSales(this.getCustomer);
    /* // Check if the user parent ID exists
    if (localStorage.getItem('userParentId') !== null) {
      // Check if the specific sales is editable
      this.editSales(this.getCustomer);
    } */
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changing");
    this.customer = changes.getCustomer.currentValue;
  }

  getSales(getCustomers: any): void {
    console.log(getCustomers.customerId);
    this.salesService.getAll(getCustomers.customerId).subscribe((res: Sales[]) => {
      this.salesAry = res;
      console.log(this.salesAry);
      this.salesAry.forEach((dataset: any, index: number) => {
        console.log(this.salesAry[index].parentId);
        // Enable edit link for respective user
        this.salesAry[index]['isEditable'] = this.salesAry[index].parentId === Number(localStorage.getItem('userParentId')) ? true : false;  
        console.log('Can edit :: '+this.salesAry[index]['isEditable']);
        // Make all sales non-editable by default
        this.rearrangeHeader = false;
        this.salesAry[index]['editNow'] = false;
        this.salesAry[index]['isUpdated'] = false;
        // Set update datetime as empty by default
        this.salesAry[index]['updateDateTime'] = '';
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
    item.editNow = false;
    this.rearrangeHeader = false;
    this.ref.detectChanges();
  }

  updateSales(event: any, item: any) {
    event.stopPropagation();
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
        // Log data changes on events
        this.addEvents(this.notification, item, 'Updated Sales', 'updated');
        // Inform the user
        this.success = 'The invoice number ('+item.invoices+') has been updated successfully';
        this.rearrangeHeader = false;
        item.editNow = false;
        // Remove old data from a specific selected sales
        this.sales.splice(this.sales.length-1, 1);
        console.log(this.sales);
        this.ref.detectChanges();
      }, (err) => {
        this.error = err; 
        // Check if the sales data has not been added
        this.ref.detectChanges();
      });
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
        notification.description = '<strong>'+this.parent.convertCase(localStorage.getItem('currentUser'))+'</strong> have completely created the sales for <strong>'+sale.customerName+'</strong>.';
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
    }
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

  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
