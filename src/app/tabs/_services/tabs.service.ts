import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  updatedLinksObj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changeEmitted$ = this.updatedLinksObj.asObservable();
  getContainerObj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changeEmittedGC$ = this.getContainerObj.asObservable();
  getTabObj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changeEmittedGT$ = this.getTabObj.asObservable();
  updateTabStyleStr: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changeEmittedST$ = this.updateTabStyleStr.asObservable();

  constructor() { }

  updatedLinks(obj: any) {
    return this.updatedLinksObj.next(obj);
  }

  getContainer(obj: any) {
    return this.getContainerObj.next(obj);
  }

  getTab(obj: any) {
    return this.getTabObj.next(obj);
  }

  updateTabStyle(str: string) {
    return this.updateTabStyleStr.next(str);
  }
}
