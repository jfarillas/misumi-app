import { 
  Component, 
  OnInit,
  Input,
  Output,
  OnChanges, 
  SimpleChanges,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ViewChild,
  ComponentFactoryResolver,
  EventEmitter,
  ViewContainerRef,
} from '@angular/core';
import { Router,  NavigationExtras,ActivatedRoute } from '@angular/router';
import { TabComponent } from '../tab/tab.component';
import { DynamicTabsDirective } from './dynamic-tabs.directive';

import { TabsService } from './_services/tabs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements AfterContentInit, OnChanges {

  dynamicTabs: TabComponent[] = [];
  showTab: string;
  customerData: any = [];
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @ViewChild(DynamicTabsDirective) dynamicTabPlaceholder: DynamicTabsDirective;
  @Input() listCustomers: any = [];
  @Input() showUpdatedTab: string;
  @Output() pushCloseTabs: EventEmitter<any> = new EventEmitter();
  @Output() pushTabContainerRef: EventEmitter<any> = new EventEmitter();
  @Output() pushSelectedTab: EventEmitter<any> = new EventEmitter();

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private tabsService: TabsService
  ) { }

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      // Emit selected tab to be closed when "Customer" link has been clicked in the sidebar
      this.pushSelectedTab.emit(this.tabs.first);
      this.selectTab(this.tabs.first);
      // hide the first tab styles
      this.showTab = '';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Changing on tab's breadcrumbs for customer list...");
    console.log(changes);
    // Update list of customers once modify the data
    if (changes.listCustomers) {
      if (Object.prototype.toString.call(changes.listCustomers.currentValue) === '[object Object]') {
        this.customerData = changes.listCustomers.currentValue;
        // Show tab styles
        this.tabsService.updateTabStyle('1');
      }
    }
    // Update show tab style
    this.tabsService.changeEmittedST$.subscribe(data => {
      this.showTab = (data === '0') ? data : 'show-tab';
    });
  }

  openTab(title: string, template: any, data: any, isCloseable = false) {
    // Emit closeTabs and tab container view ref properties to bind them in "Customer" link on the sidebar 
    this.pushCloseTabs.emit(this.dynamicTabs);
    this.pushTabContainerRef.emit(this.dynamicTabPlaceholder);
    
    // get a component factory for our TabComponent
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      TabComponent
    );

    // fetch the view container reference from our anchor directive
    const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;

    // alternatively...
    // let viewContainerRef = this.dynamicTabPlaceholder;

    // create a component instance
    const componentRef = viewContainerRef.createComponent(componentFactory);

    // set the according properties on our component instance
    const instance: TabComponent = componentRef.instance as TabComponent;
    instance.title = title;
    instance.template = template.openTemplate;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;

    // Get the customer data
    this.customerData = instance.dataContext;
    console.log(this.customerData.name);

    // remember the dynamic component for rendering the
    // tab navigation headers
    this.dynamicTabs.push(componentRef.instance as TabComponent);
    console.log('Opened tab...');
    console.log(template.sourceComponent);
    // Open a tab based on specifications
    switch (template.sourceComponent) {
      case 'DetailsCustomersComponent':
        // set it active
        // load first the profile tab
        this.selectTab(this.dynamicTabs.find(dt => dt.title === 'Profile'));
      break;
      case 'DetailsReceivablesComponent':
        // set it active
        // load the payment tab
        this.selectTab(this.dynamicTabs.find(dt => dt.title === 'Payment'));
      break;

      case 'DetailsOverdueComponent':
        // set it active
        // load the payment tab
        this.selectTab(this.dynamicTabs.find(dt => dt.title === 'Payment'));
      break;
    }
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    console.log(tab.title);
    // show tab styles
    if (tab.title !== '') {
      this.showTab = 'show-tab';
    }
    this.tabs.toArray().forEach(tab => (tab.active = false));
    this.dynamicTabs.forEach(tab => (tab.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }

  closeTab(tab: TabComponent) {
    console.log(tab);
    for (let i = 0; i < this.dynamicTabs.length; i++) {
      if (this.dynamicTabs[i] === tab) {
        console.log(this.dynamicTabs);
        // destroy our dynamically created component again
        const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
        // close all tabs
        // remove the tab from our array
        this.dynamicTabs.splice(i, 1);
        this.dynamicTabs.splice(0, 1);
        this.dynamicTabs.splice(0, 1);
        this.dynamicTabs.splice(0, 1);
        viewContainerRef.remove(i);
        viewContainerRef.remove(0);
        viewContainerRef.remove(0);
        viewContainerRef.remove(0);
        console.log(this.dynamicTabs);
        // set tab index to 1st one
        this.selectTab(this.tabs.first);
        // hide the first tab styles
        this.showTab = '';
        break;
      }
    }
  }

  closeActiveTab() {
    const activeTabs = this.dynamicTabs.filter(tab => tab.active);
    if (activeTabs.length > 0) {
      // close the 1st active tab (should only be one at a time)
      this.closeTab(activeTabs[0]);
    }
  }
}
