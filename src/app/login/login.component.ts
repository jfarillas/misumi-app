import { Component, OnInit, ElementRef, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { Login } from './login';
import { Router,  NavigationExtras,ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from './_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthenticationService]
})

export class LoginComponent implements OnInit {
  logins: Login[];
  login = new Login('', '');
  @ViewChild('username') el:ElementRef;
  statuslogin:any;
  focusin: boolean = true;
  rForm: FormGroup;
  post:any;  
  usernameAlert:string="Please fill username";
  passwordAlert:string="Please fill password";
  loginAlert:string;
  loginError:boolean=false;
  returnUrl: string;
  success: string;
  error: any;
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authenticationservice:AuthenticationService,    
    public router: Router
  ) {
    this.rForm = fb.group({
      'name' : [null, Validators.required],
      'password' : [null, Validators.required],
    });
   }
  ngOnInit() {
    this.authenticationservice.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/customers';
  }

  addPost(post: {
    reset: () => void;
  }) {
   this.resetErrors();
   this.authenticationservice.login(this.login)
   .subscribe((res: Login[]) => {
     // Get login details
     this.logins = res;
     // Inform the user
     this.success = 'Logged in successfully';
     // Reset the form
     this.rForm.reset();
     // Redirect and change into Home Component
     this.router.navigate([this.returnUrl]); 
   }, (err) => this.loginError = true);

  }
  private resetErrors() {
    this.success = '';
    this.error = '';
  }

}