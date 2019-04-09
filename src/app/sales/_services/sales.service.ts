import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Sales } from '../sales';
import { Notifications } from '../../notifications/notifications'

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  baseUrl = environment.baseUrl + '/api/sales';
  sales: Sales[];
  notifications: Notifications[];
  updatedEventsObj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  notifData = this.updatedEventsObj.asObservable();
  updatedInvoicesObj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changeEmitted$ = this.updatedInvoicesObj.asObservable();
  getCustomerObj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changeEmittedCustomer$ = this.getCustomerObj.asObservable();

  constructor(private http: HttpClient) { }

  getAll(userId: string, designation: string, customerId: string): Observable<Sales[]> {
    return this.http.get(`${this.baseUrl}/list.php?user_id=`+userId+`&customer_id=`+customerId).pipe(
      map((res) => {
        if (res) {
          this.sales = res['data'];
        } else {
          this.sales = [];
        }
        return this.sales;
    }),
    catchError(this.handleError));
  }

  store(sale: Sales): Observable<Sales[]> {
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(`${this.baseUrl}/store.php`, { data: sale }, options)
      .pipe(map((res) => {
        this.sales.unshift(res['data']);
        return this.sales;
      }),
      catchError(this.handleError));
  }

  update(sale: Sales): Observable<Sales[]> {
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(`${this.baseUrl}/update.php`, { data: sale }, options)
      .pipe(map((res) => {
        this.sales.push(res['data']);
        return this.sales;
      }),
      catchError(this.handleError));
  }

  delete(sale: Sales): Observable<Sales[]> {
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(`${this.baseUrl}/delete.php`, { data: sale }, options)
      .pipe(map((res) => {
        this.sales.push(res['data']);
        return this.sales;
      }),
      catchError(this.handleError));
  }
  
  getAccountsParentId(customerId: string): Observable<Sales[]> {
    return this.http.get(`${this.baseUrl}/listparentid.php?customer_id=`+customerId).pipe(
      map((res) => {
        if (res) {
          this.sales = res['data'];
        } else {
          this.sales = [];
        }
        return this.sales;
    }),
    catchError(this.handleError));
  }

  updatedInvoices(res: any) {
    return this.updatedInvoicesObj.next(res);
  }

  getCustomer(res: any) {
    console.log('dsss');
    return this.getCustomerObj.next(res);
  }

  updatedEvents(res: any) {
    return this.updatedEventsObj.next(res);
  }

  getUpdatedEvents() {
    return this.updatedEventsObj.getValue();
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
