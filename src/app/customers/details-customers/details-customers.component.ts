import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { TabsComponent } from './../../tabs/tabs.component';

import { NotificationsService } from './../../notifications/_services/notifications.service';

@Component({
  selector: 'app-details-customers',
  templateUrl: './details-customers.component.html',
  styleUrls: ['./details-customers.component.css']
})
export class DetailsCustomersComponent {

  @ViewChild('profileContainer') openProfileTemplate : any;
  @ViewChild('paymentsContainer') openPaymentTemplate : any;
  @ViewChild('salesContainer') openSalesTemplate : any;
  @ViewChild(TabsComponent) tabsComponent: any;
  @Input() updateEvents: any = [];

  constructor(private notificationsService: NotificationsService) { }

  openCustomerProfile(customer: any) {
    console.log('open profile tab...');
    this.tabsComponent.openTab(
      `Profile`,
      this.openProfileTemplate,
      customer,
      true
    );
    this.tabsComponent.openTab(
      `Payment`,
      this.openPaymentTemplate,
      customer,
      true
    );
    this.tabsComponent.openTab(
      `Sales`,
      this.openSalesTemplate,
      customer,
      true
    );
  }

  pushUpdatedEvents(notifications: any) {
    this.updateEvents = notifications;
    console.log('Loading notifications...');
    console.log(this.updateEvents);
    this.notificationsService.updatedEvents(notifications)
    return notifications;
  }
}
