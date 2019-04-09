import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Customers } from '../customers';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  baseUrl = environment.baseUrl+'/api/customers';
  customers: Customers[];
  updatedCustomerObj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changeEmittedCL$ = this.updatedCustomerObj.asObservable();

  constructor(private http: HttpClient) { }

  store(customer: Customers): Observable<Customers[]> {
    console.log("Customer to be added:");
    console.log(customer);
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(`${this.baseUrl}/store`, { data: customer }, options)
      .pipe(map((res) => {
        //this.customers.push(res['data']);
        return this.customers;
      }),
      catchError(this.handleError));
  }

  update(customer: Customers): Observable<any> {
    console.log("Customer to be updated:");
    console.log(customer);
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(`${this.baseUrl}/update`, { data: customer }, options)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  updatedCustomer(res: any) {
    return this.updatedCustomerObj.next(res);
  }
  
  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}

