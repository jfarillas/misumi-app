import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

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
    return this.http.post(`${this.baseUrl}/store`, { data: account })
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
