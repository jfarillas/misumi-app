import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Sales } from '../../../sales/sales';

@Injectable({
  providedIn: 'root'
})
export class OverdueInvoicesService {

  baseUrl = environment.baseUrl+'/api/sales';
  customers: Sales[];

  constructor(private http: HttpClient) { }

  async getAll(userId: number): Promise<Sales[]> {
    try {
      const res = await this.http.get(`${this.baseUrl}/overdueinvoices.php?user_id=`+userId).toPromise();
      return res['data'];
    }
    catch (error) {
      return Promise.reject(error);
    }
  }
  
  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
