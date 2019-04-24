import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy, 
  Output, 
  Input,
  ViewChild,
  ContentChildren,
  QueryList,
  EventEmitter,
  SimpleChanges, 
  OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersComponent } from '../customers/customers.component';
import { HeaderComponent } from '../header/header.component';
import { TabsComponent } from '../tabs/tabs.component';
import { TabComponent } from '../tab/tab.component';

import { DataService } from './../shared/data.service';
import { TabsService } from './../tabs/_services/tabs.service';

import { DynamicTabsDirective } from './../tabs/dynamic-tabs.directive';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnChanges {
  
  @Input() newTitle: string = '';
  @Input() closeTabs: any;
  @Input() tabContainerRef: any;
  @Input() getSelectedTab: any;
  @Output() getUpdatedCustomerTitle: EventEmitter<any> = new EventEmitter();
  isNotStaff: boolean;
  isCloseableTabs: boolean;
  dynamicTabs: TabComponent[] = [];
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @ViewChild(DynamicTabsDirective) dynamicTabPlaceholder: DynamicTabsDirective;
  showUpdatedTabObj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changeEmittedST$ = this.showUpdatedTabObj.asObservable();
  

  constructor(
    private modalService: NgbModal,
    private dataService: DataService,
    private tabsService: TabsService,
    private headerComponent: HeaderComponent,
    private tabsComponent: TabsComponent,
    private ref: ChangeDetectorRef
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
    // Hide "New Account" link if the user is staff only.
    this.isNotStaff = localStorage.getItem('designation') !== 'staff' ? true : false;
    // Close tabs links are only available when a certain tab is open.
    // By default, set it to false
    this.isCloseableTabs = false;
  }

  ngOnChanges(change: SimpleChanges) {
    // Update "Customers" link into closing tabs
    this.tabsService.changeEmitted$.subscribe(data => {
      console.log("Update Customers link into closing tabs...");
      console.log(data);
      this.isCloseableTabs = true;
      this.closeTabs = data;
      this.ref.detectChanges();
    });

    // Get tab container view ref
    this.tabsService.changeEmittedGC$.subscribe(data => {
      console.log("Get tab container view ref...");
      console.log(data);
      this.tabContainerRef = data;
      this.ref.detectChanges();
    });

    // Get selected tab
    this.tabsService.changeEmittedGT$.subscribe(data => {
      console.log("Get selected tab...");
      console.log(data);
      this.getSelectedTab = data;
      this.ref.detectChanges();
    });
  }

  changeTitleCustomers(headerTitle: string) {
    this.getUpdatedCustomerTitle.subscribe((title: string) => this.changeTitle(title));
    this.getUpdatedCustomerTitle.emit(headerTitle);
  }

  changeTitle(title: string) {
    this.newTitle = title;
  }

  closeTab(openTabs: any, event: Event) {
    console.log('Tab container view ref.');
    console.log(this.tabContainerRef);
    console.log(this.getSelectedTab);
    for (let i = 0; i < openTabs.length; i++) {
      // destroy our dynamically created component again
      const viewContainerRef = this.tabContainerRef.viewContainer;
      // close all tabs
      // remove the tab from our array
      openTabs.splice(i, 1);
      openTabs.splice(0, 1);
      openTabs.splice(0, 1);
      openTabs.splice(0, 1);
      viewContainerRef.remove(i);
      viewContainerRef.remove(0);
      viewContainerRef.remove(0);
      viewContainerRef.remove(0);
      console.log(openTabs);
      // set tab index to 1st one
      this.selectTab(this.getSelectedTab, openTabs);
      break;
    }
    event.stopPropagation();
    //this.tabsComponent.closeTab(tabs);
  }

  selectTab(tab: TabComponent, openTabs: any) {
    // deactivate all tabs
    // show tab styles
    if (!tab.title) {
      // hide the first tab styles
      this.tabsService.updateTabStyle('0');
    }
    openTabs.forEach(tab => (tab.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }

}
