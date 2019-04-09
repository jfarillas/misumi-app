import { 
  Component, 
  OnInit,
  Input,
  OnChanges, 
  SimpleChanges,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
} from '@angular/core';
import { Router,  NavigationExtras,ActivatedRoute } from '@angular/router';
import { TabComponent } from '../tab/tab.component';
import { DynamicTabsDirective } from './dynamic-tabs.directive';

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

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private router: Router
  ) { }

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
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
      }
    }
  }

  openTab(title: string, template, data, isCloseable = false) {
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
