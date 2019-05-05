import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Input() name: string;
  @Input() code: string;
  // Has been requested to create a new password
  requested: boolean = false;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let url = this.activatedRoute.snapshot.url.join().split(',');
    if (url[1]) {
      switch (url[1]) {
        case 'update':
          this.requested = true;
          if (url[2]) {
            // Forgot password service
            // Get email endpoint from an account name
            this.name = url[2];
            // Check if the security pin exist
            if (url[3]) {
              this.code = url[3];
            }
          }
        break;
      }
    }
  }

}
