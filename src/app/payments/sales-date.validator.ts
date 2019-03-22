import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function SalesDate(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const matchingControl = formGroup.controls[matchingControlName];

        // return null if controls haven't initialised yet
        if (!controlName || !matchingControl) {
          return null;
        }

        // set error on matchingControl if validation fails
        if (new Date(controlName) > new Date(matchingControl.value)) {
            matchingControl.setErrors({ salesDate: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
