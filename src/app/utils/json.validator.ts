import { Survey } from './../models/survey.model';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function jsonValidator(control: AbstractControl): ValidationErrors | null {
  try {
    let survey: Survey  = JSON.parse(control.value);
    console.log(survey);
    if (!survey) {
      return { jsonInvalid: true };
    }
  } catch (e) {
    return { jsonInvalid: true };
  }

  return null;
}
