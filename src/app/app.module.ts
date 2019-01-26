import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AccountsComponent } from './accounts/accounts.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './home/profile/profile.component';
import { CustomersComponent } from './customers/customers.component';
import { SalesComponent } from './sales/sales.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { ListCustomersComponent } from './customers/list-customers/list-customers.component';

import { AuthenticationService }  from './login/_services/authentication.service';
import { AuthguardService }  from './login/_services/authguard.service';

import { NgbModule, NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSortModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ListCustomersPipe } from './customers/list-customers/list-customers.pipe';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent },
    { path: '', component: HomeComponent,canActivate: [AuthguardService],
    children: [
        // { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'customers', component: ListCustomersComponent,canActivate: [AuthguardService] },
        { path: 'new-customer', component: CustomersComponent,canActivate: [AuthguardService] },
        { path: 'sales', component: SalesComponent,canActivate: [AuthguardService] },
      ] },

    // otherwise redirect to home
    { path: '**', redirectTo: '/login' }

];

@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    CustomersComponent,
    SalesComponent,
    SidebarComponent,
    HeaderComponent,
    ListCustomersComponent,
    ListCustomersPipe,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgbPaginationModule,
    NgbAlertModule,
    NgSelectModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthenticationService,
    AuthguardService,
    HeaderComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
