import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Sales } from '../sales';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  baseUrl = environment.baseUrl+'/api/users';
  sales: Sales[];

  constructor(private http: HttpClient) { }

  /* getAll(): Observable<Sales[]> {
    return this.http.get(`${this.baseUrl}/list.php`).pipe(
      map((res) => {
        this.sales = res['data'];
        console.log("Sales listed:");
        console.log(this.sales);
        return this.sales;
    }),
    catchError(this.handleError));
  } */

  store(sale: Sales): Observable<Sales[]> {
    console.log("Account to be added:");
    console.log(sale);
    return this.http.post(`${this.baseUrl}/store.php`, { data: sale })
      .pipe(map((res) => {
        //this.sales.push(res['data']);
        return this.sales;
      }),
      catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
