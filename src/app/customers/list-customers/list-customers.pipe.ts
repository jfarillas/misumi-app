import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listCustomers'
})
export class ListCustomersPipe implements PipeTransform {

  transform(customers : any, data: string): any[] {
    if (customers && typeof data !== 'undefined') {
      if (data.length !== 0 && data.trim() !== '') {
        return customers.filter((listing: any) => {
          let re = new RegExp(data, 'i');
          return re.test(listing.customerKey) || re.test(listing.businessRegNo)
          || re.test(listing.name) || re.test(listing.contactNo)
          || re.test(listing.status);
        });
      } else {
        return customers;
      }
    } else {
      return customers;
    }
  }

}
