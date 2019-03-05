import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Accounts } from '../accounts';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  baseUrl = environment.baseUrl+'/api/users';
  accounts: Accounts[];

  constructor(private http: HttpClient) { }

  store(account: Accounts): Observable<Accounts[]> {
    console.log("Account to be added:");
    console.log(account);
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(`${this.baseUrl}/store`, { data: account }, options)
      .pipe(map((res) => {
        //this.accounts.push(res['data']);
        return this.accounts;
      }),
      catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
