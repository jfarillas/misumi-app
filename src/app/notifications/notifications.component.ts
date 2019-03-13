import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges
} from '@angular/core';
import { Notifications } from './notifications';

import { NotificationsService } from './_services/notifications.service';
import { SalesService } from './../sales/_services/sales.service';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit, OnChanges {
  @Input() getCustomer: any;
  @Input() updateEvents: any;
  customer: any;
  notifications: Notifications[];
  notificationsAry: any = [];
  notifStatus: number;
  error = '';
  notification = new Notifications('', '', '', '', '');

  constructor(
    private notificationsService: NotificationsService,
    private salesService: SalesService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getNotifications();
  }

  ngOnChanges(change: SimpleChanges) {
    // Update notifications
    this.notificationsService.changeEmitted$.subscribe(data => {
      console.log("Latest notifications...");
      this.notificationsAry = data;
      this.listNotifications(this.notificationsAry, 'push');
      this.ref.detectChanges();
    });
  }

  getNotifications(): void {
    this.notificationsService.getAll().subscribe((res: Notifications[]) => {
      this.notificationsAry = res;
      console.log("Notifications...");
      this.listNotifications(this.notificationsAry, 'list');
      console.log(this.notificationsAry);
      this.ref.detectChanges();
      // No records found when there is/are no data fetched
      console.log(this.notificationsAry.length);
      /* this.hasData = this.notificationsAry.length > 0 ? true : false;
      console.log(this.hasData); */
      // Check if the sales data has been fetched
      this.ref.detectChanges();
    }, (err) => {
      this.error = err;
    });
  }

  getEventTime(dateTime: any) {
    return moment(dateTime).fromNow()
  }

  listNotifications(notifications: any, action: string) {
    if (typeof notifications !== 'undefined') {
      switch (action) {
        case 'list':
        notifications.forEach((dataset: any, index: number) => {
          if (notifications[index].createDateTime !== null) {
            notifications[index]['notifStatus'] = 1;
            // Compute time difference
            notifications[index]['notifTime'] = this.getEventTime(notifications[index].createDateTime);
            console.log(notifications[index].createDateTime);
            console.log(this.getEventTime(notifications[index].createDateTime));
            this.ref.detectChanges();
          } else if (notifications[index].updateDateTime !== null) {
            notifications[index]['notifStatus'] = 2;
            // Compute time difference
            notifications[index]['notifTime'] = this.getEventTime(notifications[index].updateDateTime);
            console.log(notifications[index].updateDateTime);
            console.log(this.getEventTime(notifications[index].updateDateTime));
            this.ref.detectChanges();
          }
        });
        break;
        case 'push':
        notifications.forEach((dataset: any, index: number) => {
          let last = 0;
          if (typeof notifications[last].createdatetime !== 'undefined') {
            notifications[last]['notifStatus'] = 1;
            // Compute time difference
            notifications[last]['notifTime'] = this.getEventTime(notifications[last].createdatetime);
            console.log(notifications[last].createdatetime);
            console.log(this.getEventTime(notifications[last].createdatetime));
            this.ref.detectChanges();
          } else if (typeof notifications[last].updatedatetime !== 'undefined') {
            notifications[last]['notifStatus'] = 2;
            // Compute time difference
            notifications[last]['notifTime'] = this.getEventTime(notifications[last].updatedatetime);
            console.log(notifications[last].updatedatetime);
            console.log(this.getEventTime(notifications[last].updatedatetime));
            this.ref.detectChanges();
          }
        });
        break;
      }
      
    }
    
  }
    

}
