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
    // Generate parent ID if the user accounts to be created are for admin, directors or managers
    if (localStorage.getItem('userParentId') === null) {
      let start: number;
      switch (account.designation) {
        case 'Admin':
          start = 0;
          this.generateParentId(account, 'admin', start);
        break;
        case 'Director':
          start = 1000;
          this.generateParentId(account, 'director', start);
        break;
        case 'Manager':
          start = 2000;
          this.generateParentId(account, 'manager', start);
        break;
      }
    } else {
      account.parentId = Number(localStorage.getItem('userParentId'));
    }
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

  generateParentId(account: any, designation: string, start: number) {
    switch (designation) {
      case 'admin':
        this.storeParentId(account, 'lastAdminId', start);
      break;
      case 'director':
        this.storeParentId(account, 'lastDirectorId', start);
      break;
      case 'manager':
        this.storeParentId(account, 'lastManagerId', start);
      break;
    }
    
  }

  storeParentId(account: any, parentIdName: string, start: number) {
    if (localStorage.getItem(parentIdName) !== null) {
      let ctr = Number(localStorage.getItem(parentIdName))+1
      localStorage.setItem(parentIdName, ctr.toString());
      account.parentId = localStorage.getItem(parentIdName)
      console.log('have parent id');
    } else {
      let ctr = start+1;
      localStorage.setItem(parentIdName, ctr.toString());
      account.parentId = localStorage.getItem(parentIdName);
      console.log('no parent id');
    }
    console.log(localStorage.getItem(parentIdName))
  }
}
