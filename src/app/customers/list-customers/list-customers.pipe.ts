import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listCustomers'
})
export class ListCustomersPipe implements PipeTransform {

  transform(customers : any, data: string): any[] {
    if (customers && typeof data !== 'undefined') {
      if (data.length !== 0 && data.trim() !== '') {
        return customers.filter((listing: any) => {
          return listing.customerKey === data || listing.businessRegNo === data 
          || listing.name === data || listing.contactNo === data
          || listing.status === data;
        });
      } else {
        return customers;
      }
    } else {
      return customers;
    }
  }

}
