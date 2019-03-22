import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from '@angular/forms';

import { SalesDate } from './sales-date.validator';

@Directive({
  selector: '[salesDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SalesDateDirective, multi: true }]
})
export class SalesDateDirective implements Validator {
  @Input('salesDate') salesDate: string[] = [];

    validate(formGroup: FormGroup): ValidationErrors {
        console.log('sales date error');
        return SalesDate(this.salesDate[0], this.salesDate[1])(formGroup);
    }

}
