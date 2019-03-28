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
        this.storeHierarchy(res);
        return this.accounts;
      }),
      catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }

  storeHierarchy(res: any) {

    console.log('child id :: '+res['data'].id);
    console.log('parent user id :: '+Number(localStorage.getItem('userId')));
    const account = {
      userId: res['data'].id,
      parentUserId: localStorage.getItem('userId') !== null ? Number(localStorage.getItem('userId')) : 0,
      childId: 0
    };
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    const promiseHierarchy = this.http.post(`${this.baseUrl}/storehierarchy`, account).toPromise();
    promiseHierarchy.then((res) => {
      console.log('Hierarchy added');
      console.log(res);
        this.updateHierarchy(res);
    }, (error) => {
      console.log(error.message);
    });
  }

  updateHierarchy(res: any) {
    console.log('update child id :: '+res['data'].userId);
    console.log('update parent user id :: '+Number(localStorage.getItem('userId')));
    const account = {
      userId: localStorage.getItem('userId') !== null ? Number(localStorage.getItem('userId')) : 0,
      parentId: localStorage.getItem('userId') !== null ? Number(localStorage.getItem('userId')) : 0,
      childId: (res['data'].userId) ? res['data'].userId : 0
    };
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    console.log(account);

    /* let ctr = Number(localStorage.getItem('ctrAccounts'))+1;
    localStorage.setItem('ctrAccounts', ctr.toString()); */

    //if (localStorage.getItem('ctrAccounts') === null || Number(localStorage.getItem('ctrAccounts')) <= 2) {
    
    if (localStorage.getItem('userId') !== null) {
      this.checkSameParent(`${this.baseUrl}/checkhierarchy.php?parentid=`+account.parentId, account);
      /* if (Number(localStorage.getItem('ctrAccounts')) > 2) {
        account['parentUserId'] = localStorage.getItem('userId') !== null ? Number(localStorage.getItem('userId')) : 0;
        console.log(account);
        this.storeSameParent(`${this.baseUrl}/storehierarchy`, account);
      } */
    }
  }

  checkSameParent(url: string, account: any) {
    const promiseHierarchy = this.http.get(url).toPromise();
    promiseHierarchy.then((res) => {
      console.log('Check hierarchy');
      console.log(res);
      const isObjResEmpty = !Object.keys(res).length; 
      if (isObjResEmpty) {
        console.log('Empty same parent');
        const promiseHierarchy = this.http.post(`${this.baseUrl}/updatehierarchy`, account).toPromise();
        promiseHierarchy.then((res) => {
          console.log('Hierarchy updated');
          console.log(res);
          //return res;
        }, (error) => {
          console.log(error.message);
        });
      } else {
        console.log('With same parent :: '+res[0].parentid);
        //account['parentUserId'] = localStorage.getItem('userId') !== null ? Number(localStorage.getItem('userId')) : 0;
        account['parentUserId'] = res[0].parentid;
        console.log(account);
        this.storeSameParent(`${this.baseUrl}/storehierarchy`, account);
      }
    }, (error) => {
      console.log(error.message);
    });
  }

  storeSameParent(url: string, account: any) {
    const promiseHierarchy = this.http.post(url, account).toPromise();
    promiseHierarchy.then((res) => {
      console.log('Another same hierarchy added');
      console.log(res);
      return res;
    }, (error) => {
      console.log(error.message);
    });
  }
}
