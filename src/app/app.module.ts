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
import { ProfileComponent } from './customers/profile/profile.component';
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
import { DetailsCustomersComponent } from './customers/details-customers/details-customers.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tab/tab.component';
import { DynamicTabsDirective } from './tabs/dynamic-tabs.directive';
import { ChartsModule } from 'ng2-charts';
import { PaymentsComponent } from './payments/payments.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SalesDateDirective } from './payments/sales-date.directive';
import { ReceivablesTodayComponent } from './receivables/receivables-today/receivables-today.component';
import { OverdueInvoicesComponent } from './overdue/overdue-invoices/overdue-invoices.component';
import { DetailsReceivablesComponent } from './receivables/details-receivables/details-receivables.component';
import { DetailsOverdueComponent } from './overdue/details-overdue/details-overdue.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent },
    { path: '', component: HomeComponent,canActivate: [AuthguardService],
    children: [
        // { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'customers', component: DetailsCustomersComponent,canActivate: [AuthguardService] },
        { path: 'new-customer', component: CustomersComponent,canActivate: [AuthguardService] },
        { path: 'new-account', component: AccountsComponent,canActivate: [AuthguardService] },
        { path: 'receivables-today', component: DetailsReceivablesComponent,canActivate: [AuthguardService] },
        { path: 'overdue-invoices', component: DetailsOverdueComponent,canActivate: [AuthguardService] },
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
    DetailsCustomersComponent,
    TabsComponent,
    TabComponent,
    DynamicTabsDirective,
    PaymentsComponent,
    NotificationsComponent,
    SalesDateDirective,
    ReceivablesTodayComponent,
    OverdueInvoicesComponent,
    DetailsReceivablesComponent,
    DetailsOverdueComponent,
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
    BrowserAnimationsModule,
    ChartsModule
  ],
  providers: [
    AuthenticationService,
    AuthguardService,
    HeaderComponent,
    ListCustomersComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TabComponent,
    ProfileComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
