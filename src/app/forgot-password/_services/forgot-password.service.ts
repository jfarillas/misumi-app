import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { PasswordResetRequest } from '../password-reset-request';
import { PasswordReset } from '../password-reset';
import { Secretkey } from '../secretkey';

export interface Emailref {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  baseUrl = environment.baseUrl+'/api/users';
  passwordResetRequest: PasswordResetRequest[];
  emailRef: any = [];
  passwordReset: PasswordReset[];
  secretKey: Secretkey[];

  constructor(private http: HttpClient) { }

  pwdResetRequest(passwordResetRequest: PasswordResetRequest): Observable<PasswordResetRequest[]> {
    console.log("Password reset requesting:");
    console.log(passwordResetRequest);
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(`${this.baseUrl}/pwdresetrequest`, { data: passwordResetRequest }, options)
      .pipe(map((res) => {
        //this.passwordResetRequest.push(res['data']);
        if (res) {
          this.passwordResetRequest = res['data'];
        } else {
          this.passwordResetRequest = [];
        }
        return this.passwordResetRequest;
      }),
      catchError(this.handleError));
  }

  async verifySecretkey(secretKey: Secretkey): Promise<Secretkey[]> {
    console.log("Verifying Secret key:");
    console.log(secretKey);
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    try {
      const res = await this.http.post(`${this.baseUrl}/verifysecretkey`, { data: secretKey }, options).toPromise()
      return res['data'];
    }
    catch (error) {
      return Promise.reject(error);
    }
  }

  async storeSecretKey(secretKey: Secretkey): Promise<Secretkey[]> {
    console.log("Adding Secret key:");
    console.log(secretKey);
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    try {
      const res = await this.http.post(`${this.baseUrl}/storesecretkey`, { data: secretKey }, options).toPromise();
      return res['data'];
    }
    catch (error) {
      return Promise.reject(error);
    }
  }

  getEmail(name: string): Observable<PasswordReset[]> {
    console.log("Getting Email...");
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.get(`${this.baseUrl}/getemail?name=`+name).pipe(map((res) => {
        //this.passwordResetRequest.push(res['data']);
        if (res) {
          this.passwordReset = res['data'];
        } else {
          this.passwordReset = [];
        }
        return this.passwordReset;
      }),
      catchError(this.handleError));
  }

  async update(passwordReset: PasswordReset): Promise<PasswordReset> {
    console.log("User's password to be updated:");
    console.log(passwordReset);
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    try {
      const res = await this.http.post(`${this.baseUrl}/pwdreset`, { data: passwordReset }, options).toPromise();
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
