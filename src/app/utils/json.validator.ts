import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function jsonValidator(control: AbstractControl): ValidationErrors | null {
  try {
    const survey  = JSON.parse(control.value);
    if (!survey) {
      return { jsonInvalid: true };
    }
  } catch (e) {
    return { jsonInvalid: true };
  }

  return null;
}
