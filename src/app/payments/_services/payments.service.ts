import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

//import { Sales } from '../sales';

export interface Salesref {
  value: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  baseUrl = environment.baseUrl + '/api/payments';
  salesRef: any = [];

  constructor(private http: HttpClient) { }

  getSalesRef(): Observable<Salesref[]> {
    return this.http.get(`${this.baseUrl}/listsalesref.php`).pipe(
      map((res) => {
        this.salesRef = res['data'];
        return this.salesRef;
    }),
    catchError(this.handleError));
  }

  /* getAll(): Observable<Sales[]> {
    return this.http.get(`${this.baseUrl}/list.php`).pipe(
      map((res) => {
        this.sales = res['data'];
        return this.sales;
    }),
    catchError(this.handleError));
  }

  store(sale: Sales): Observable<Sales[]> {
    return this.http.post(`${this.baseUrl}/store.php`, { data: sale })
      .pipe(map((res) => {
        this.sales.push(res['data']);
        return this.sales;
      }),
      catchError(this.handleError));
  } */

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
