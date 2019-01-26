import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }

  store(customer: Customers): Observable<Customers[]> {
    console.log("Customer to be added:");
    console.log(customer);
    return this.http.post(`${this.baseUrl}/store`, { data: customer })
      .pipe(map((res) => {
        //this.customers.push(res['data']);
        return this.customers;
      }),
      catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}

