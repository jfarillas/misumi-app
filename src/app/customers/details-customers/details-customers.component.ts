import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { TabsComponent } from './../../tabs/tabs.component';

@Component({
  selector: 'app-details-customers',
  templateUrl: './details-customers.component.html',
  styleUrls: ['./details-customers.component.css']
})
export class DetailsCustomersComponent {

  @ViewChild('profileContainer') openProfileTemplate : any;
  @ViewChild(TabsComponent) tabsComponent: any;

  constructor() { }

  openCustomerProfile(customer: any) {
    console.log('open profile tab...');
    console.log(customer);
    this.tabsComponent.openTab(
      `Profile`,
      this.openProfileTemplate,
      customer,
      true
    );
  }
  
}
