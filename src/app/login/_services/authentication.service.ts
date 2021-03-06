import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Login } from '../login';

@Injectable()
export class AuthenticationService {
  baseUrl = environment.baseUrl+'/api/users';
  logins: Login[] = [];
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }
  login(login: Login): Observable<Login[]> {
    console.log("Logging in...");
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(`${this.baseUrl}/authenticate.php`, { data: login }, options)
      .pipe(map((res) => {
        this.logins.push(res['data']);
        console.log(this.logins[0]['id']+' - '+this.logins[0]['name']);
        localStorage.setItem('userId', this.logins[0]['id']);
        localStorage.setItem('currentUser', this.logins[0]['name']);
        localStorage.setItem('currentUserEmail', this.logins[0]['email']);
        localStorage.setItem('designation', this.logins[0]['designation'].toLowerCase());
        
        return this.logins;
      }),
      catchError(this.handleError));
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('designation');
    this.getLoggedInName.emit('');
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}