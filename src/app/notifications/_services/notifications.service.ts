import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Notifications } from '../notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  baseUrl = environment.baseUrl + '/api/events';
  notifications: Notifications[] = [];
  updatedEventsObj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changeEmitted$ = this.updatedEventsObj.asObservable();

  constructor(private http: HttpClient) { }

  getAll(): Observable<Notifications[]> {
    return this.http.get(`${this.baseUrl}/list.php`).pipe(
      map((res) => {
        this.notifications = res['data'];
        return this.notifications;
    }),
    catchError(this.handleError));
  }

  store(notification: Notifications): Observable<Notifications[]> {
    // Set header content-type
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(`${this.baseUrl}/store.php`, { data: notification }, options)
      .pipe(map((res) => {
        // TODO: notification table fields should match the notification class properties
        this.notifications.unshift(res['data']);
        return this.notifications;
      }),
      catchError(this.handleError));
  }

  updatedEvents(res: any) {
    return this.updatedEventsObj.next(res);
  }

  getUpdatedEvents() {
    return this.updatedEventsObj.getValue();
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
