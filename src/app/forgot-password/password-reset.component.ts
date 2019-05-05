import { 
  Component, 
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs';

import { PasswordReset } from './password-reset';
import { Secretkey } from './secretkey';
import { ForgotPasswordService } from './_services/forgot-password.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() code: string;
  success: string;
  error: string;
  customSuccess: boolean;
  customError: boolean;
  secretKeyVerified: any = [];
  savedSecretKey: any = [];
  passwordResetUpdate: any = [];
  secretKeys: Secretkey[];
  passwordReset = new PasswordReset('', '', '');
  secretKey = new Secretkey('', '');

  // For validation
  isValid: boolean = true;
  // Pre-loader
  submitting: boolean = false;
  // Enable/disable elements (input text and button)
  enable: boolean = true;

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Username :: '+this.name);
    console.log('Code :: '+this.code);
    console.log(changes);
    if (changes.code) {
      this.secretKey.name = this.name;
      this.secretKey.secretKey = this.code;

      this.forgotPasswordService.verifySecretkey(this.secretKey).then((res: any) => {
        // Once the Secret key has been verified
        console.log(res);
        if (Object.keys(res).length === 0) {
          this.forgotPasswordService.storeSecretKey(this.secretKey).then((res: any) => {
            console.log('Secret key added.');
            this.getUserEmail();
          }, (err) => {
            console.log('Cannot add Secret key.');
            this.enable = false;
            this.error = err;
            // Check if the customer data has been added
            this.ref.detectChanges();
          });
        } else {
          console.log('cannot verified Secret key');
          this.secretKeyErrors('custom');
        }
      }, (err) => {
        console.log('cannot verified Secret key');
        this.secretKeyErrors(err);
      });
    }
  }

  getUserEmail() {
    this.forgotPasswordService.getEmail(this.name)
      .subscribe((res: PasswordReset[]) => {
        // Get the requested password reset details
        this.passwordResetUpdate = res;
        console.log(this.passwordResetUpdate);
        this.passwordResetUpdate.forEach((dataset: any, index: number) => {
          this.passwordReset.name = this.passwordResetUpdate[index].name;
          this.passwordReset.email = this.passwordResetUpdate[index].email;
        });
        
        this.submitting = false;
      }, (err) => {
        this.error = err;
        this.submitting = false;
        this.enable = false;
        // Check if the customer data has been added
        this.ref.detectChanges();
      });
  }

  resetPassword(f: {
    reset: () => void;
  }, event: Event) {
    event.preventDefault();
    this.resetErrors();
    const invalidFields = !this.passwordReset.password;
    if (invalidFields) {
      this.isValid = false;
    } else {
      this.isValid = true;
      this.submitting = true;
      // Update password
      console.log('Sending email to :: '+this.passwordReset.email);
      this.forgotPasswordService.update(this.passwordReset).then((res: any) => {
        if (Object.keys(res).length > 0) {
          this.customSuccess = true;
          this.submitting = false;
          this.enable = false;
          console.log('The password has been reset.');
        } else {
          this.resetPasswordErrors('custom');
        }
      }, (err) => {
        this.resetPasswordErrors(err);
      });
    }
  }

  private resetErrors() {
    this.success = '';
    this.error = '';
  }

  private secretKeyErrors(err: any) {
    this.enable = false;
    this.error = err;
    this.customError = (err === 'custom') ? true : false;
    // Check if the customer data has been added
    this.ref.detectChanges();
  }

  private resetPasswordErrors(err: any) {
    console.log('Cannot reset password.');
    this.submitting = false;
    this.enable = false;
    this.error = err;
    this.customError = (err === 'custom') ? true : false;
    // Check if the customer data has been added
    this.ref.detectChanges();
  }

}
