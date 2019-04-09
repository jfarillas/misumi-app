import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

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
  @ViewChild('customerContainer') openCustomerTemplate : any;
  @ViewChild(TabsComponent) tabsComponent: any;
  @Input() updateEvents: any = [];
  @Input() updateInvoices: any;
  @Input() listCustomers: any = [];
  @Input() updateProfile: any;

  constructor(
    private notificationsService: NotificationsService,
    private route: ActivatedRoute
  ) { }

  openCustomerProfile(customer: any) {
    console.log('open profile tab...');
    interface Template {
      [key: string]: any
    }
    let profileTemplate: Template = {};
    let paymentTemplate: Template = {};
    let salesTemplate: Template = {};
    let customerTemplate: Template = {};
    profileTemplate.openTemplate = this.openProfileTemplate;
    profileTemplate.sourceComponent = 'DetailsCustomersComponent';
    paymentTemplate.openTemplate = this.openPaymentTemplate;
    paymentTemplate.sourceComponent = 'DetailsCustomersComponent';
    salesTemplate.openTemplate = this.openSalesTemplate;
    salesTemplate.sourceComponent = 'DetailsCustomersComponent';
    customerTemplate.openTemplate = this.openCustomerTemplate;
    customerTemplate.sourceComponent = 'DetailsCustomersComponent';

    this.tabsComponent.openTab(
      `Profile`,
      profileTemplate,
      customer,
      true
    );
    this.tabsComponent.openTab(
      `Payment`,
      paymentTemplate,
      customer,
      true
    );
    this.tabsComponent.openTab(
      `Sales`,
      salesTemplate,
      customer,
      true
    );
    this.tabsComponent.openTab(
      `Update Details`,
      customerTemplate,
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

  pushUpdatedInvoices(invoices: any) {
    this.updateInvoices = invoices;
    console.log('Updating invoices from add new data...');
    console.log(this.updateInvoices);
  }

  pushUpdatedCustomers(res: any) {
    this.listCustomers = res;
    console.log('Updating customers data...');
    console.log(this.listCustomers);
  }

  pushUpdatedProfile(res: any) {
    this.updateProfile = res;
    console.log('Updating customer profile data...');
    console.log(this.updateProfile);
  }
}
