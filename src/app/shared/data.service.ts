import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient, } from '@angular/common/http';

import * as Countries from './../../assets/json/countries.json';
import * as moment from 'moment';

export interface Country {
  name: string;
  code: string;
}

export interface CustomerStatus {
  code: string;
  description: string;
}

export interface Title {
  titleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Empty array for list of countries
  countriesArr = [];
  constructor(private http: HttpClient) { }

  getCountries(term: string = null): Observable<any> {
    return this.http.get("./../../assets/json/countries.json")
                    .pipe(map(res => res));

  }

  getCustomerStatus(term: string = null): Observable<CustomerStatus[]> {
    
    let items = getCustomerStatusList();
    if (term) {
        items = items.filter(x => x.code.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    
    console.log(getCustomerStatusList());
    return of(items).pipe(delay(500));
  }

  accessRights(item: any, module: string, hourPassed: number) {
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    switch (module) {
      case 'sales':
        const diffSales = moment(now).diff(moment(item.createDateTime));
        console.log('datetime diff :: '+diffSales);
        return item.parentId === Number(localStorage.getItem('userParentId')) && diffSales < hourPassed;
      break;
      case 'payments':
        const diffPayments = moment(now).diff(moment(item.createdatetime));
        console.log('datetime diff :: '+diffPayments);
        return item.parentid === Number(localStorage.getItem('userParentId')) && diffPayments < hourPassed;
      break;
    }
  }
}

function getCustomerStatusList()
{
  return [
    {"code": "cleared", "description": "Cleared"}
  ];
}
