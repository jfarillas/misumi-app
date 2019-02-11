import { 
  Component, 
  OnInit,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef
} from '@angular/core';
import { Router,  NavigationExtras,ActivatedRoute } from '@angular/router';
import { TabComponent } from '../tab/tab.component';
import { DynamicTabsDirective } from './dynamic-tabs.directive';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements AfterContentInit {

  dynamicTabs: TabComponent[] = [];
  showTab: string;
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @ViewChild(DynamicTabsDirective) dynamicTabPlaceholder: DynamicTabsDirective;

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
    instance.template = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;

    // remember the dynamic component for rendering the
    // tab navigation headers
    this.dynamicTabs.push(componentRef.instance as TabComponent);

    // set it active
    // first to load profile tab
    this.selectTab(this.dynamicTabs.find(dt => dt.title === 'Profile'));
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
        // close other tabs when closing profile page
        if (i === 0) {
          // remove the tab from our array
          this.dynamicTabs.splice(i, 1);
          this.dynamicTabs.splice(0, 1);
          this.dynamicTabs.splice(0, 1);
          viewContainerRef.remove(i);
          viewContainerRef.remove(0);
          viewContainerRef.remove(0);
          console.log(this.dynamicTabs);
          // set tab index to 1st one
          this.selectTab(this.tabs.first);
          // hide the first tab styles
          this.showTab = '';
        } else {
          // remove the tab from our array
          this.dynamicTabs.splice(i, 1);
          viewContainerRef.remove(i);
        }
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
