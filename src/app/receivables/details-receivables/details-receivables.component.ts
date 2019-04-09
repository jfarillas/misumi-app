import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { TabsComponent } from './../../tabs/tabs.component';

import { NotificationsService } from './../../notifications/_services/notifications.service';

@Component({
  selector: 'app-details-receivables',
  templateUrl: './details-receivables.component.html',
  styleUrls: ['./details-receivables.component.css']
})
export class DetailsReceivablesComponent {

  @ViewChild('paymentsContainer') openPaymentTemplate : any;
  @ViewChild(TabsComponent) tabsComponent: any;
  @Input() getItem: any;
  @Input() updateEvents: any = [];
  template: any = {};

  constructor( 
    private route: ActivatedRoute,
    private notificationsService: NotificationsService 
  ) { }

  openCustomerPayment(item: any) {
    console.log('open payment tab...');
    interface Template {
      [key: string]: any
    }
    let paymentTemplate: Template = {};
    paymentTemplate.openTemplate = this.openPaymentTemplate;
    paymentTemplate.sourceComponent = 'DetailsReceivablesComponent';
    this.getItem = item;
    console.log(this.getItem);
    this.tabsComponent.openTab(
      `Payment`,
      paymentTemplate,
      item,
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
