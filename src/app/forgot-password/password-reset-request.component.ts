import { 
  Component, 
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs';

import { PasswordResetRequest } from './password-reset-request';
import { ForgotPasswordService } from './_services/forgot-password.service';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.css']
})
export class PasswordResetRequestComponent implements OnInit {
  success: boolean;
  error: string;
  customError: boolean;
  passwordResetRequests: PasswordResetRequest[];
  passwordResetRequest = new PasswordResetRequest('');

  // For validation
  isValid: boolean = true;

  // Pre-loader
  submitting: boolean = false;

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  request(f: {
    reset: () => void;
  }, event: Event) {
    event.preventDefault();
    this.resetErrors();
    //Fields checker
    let regEmail = RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$', 'i');
    const invalidFields = !this.passwordResetRequest.email || !regEmail.test(this.passwordResetRequest.email);
    if (invalidFields) {
      this.isValid = false;
    } else {
      this.isValid = true;
      this.submitting = true;
      this.forgotPasswordService.pwdResetRequest(this.passwordResetRequest)
        .subscribe((res: PasswordResetRequest[]) => {
          if (res) {
            // Get the requested password reset details
            this.passwordResetRequests = res;
            console.log(res);
            // Inform the user
            this.success = true;
            // Reset the form
            f.reset();
            this.submitting = false;
          } else {

            this.SendFailErrors('custom');
          }
        }, (err) => {
          this.SendFailErrors(err);
        });
    }
  }

  private resetErrors() {
    this.success = false;
    this.error = '';
  }

  private SendFailErrors(err: any) {
    this.error = err;
    this.submitting = false;
    this.customError = (err === 'custom') ? true : false;
    // Check if the customer data has been added
    this.ref.detectChanges();
  }

}
