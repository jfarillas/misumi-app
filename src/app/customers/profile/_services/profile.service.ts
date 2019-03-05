import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

export interface Totalsales {
  totalSales: string;
}

export interface Totalpayments {
  totalPayments: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrlSales = environment.baseUrl + '/api/sales';
  baseUrlPayments = environment.baseUrl + '/api/payments';
  totalSales: any = [];
  totalPayments: any = [];

  constructor(private http: HttpClient) { }

  getTotalSales(customerId: string): Observable<Totalsales[]> {
    return this.http.get(`${this.baseUrlSales}/totalsales.php?customer_id=`+customerId).pipe(
      map((res) => {
        this.totalSales = res['data'];
        return this.totalSales;
    }),
    catchError(this.handleError));
  }

  getTotalPayments(customerId: string): Observable<Totalpayments[]> {
    return this.http.get(`${this.baseUrlPayments}/totalpayments.php?customer_id=`+customerId).pipe(
      map((res) => {
        this.totalPayments = res['data'];
        return this.totalPayments;
    }),
    catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
