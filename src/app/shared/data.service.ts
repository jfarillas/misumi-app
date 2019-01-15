import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient, } from '@angular/common/http';

import * as Countries from './../../assets/json/countries.json';

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
}

function getCustomerStatusList()
{
  return [
    {"code": "cleared", "description": "Cleared"}
  ];
}
