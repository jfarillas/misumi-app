import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { ListCustomers } from '../list-customers';

@Injectable({
  providedIn: 'root'
})
export class ListCustomersService {
  baseUrl = environment.baseUrl+'/api/customers';
  customers: ListCustomers[];

  constructor(private http: HttpClient) { }

  async getAll(): Promise<ListCustomers[]> {
    try {
      const res = await this.http.get(`${this.baseUrl}/list`).toPromise();
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

