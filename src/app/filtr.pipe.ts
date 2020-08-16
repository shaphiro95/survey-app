import { SurveyFb } from './models/survey-fb.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtr'
})
export class FiltrPipe implements PipeTransform {

  transform(items: any[], filterBy: string): any {
    if (!filterBy) {
      return items;
    }
    return items.filter(item => item.survey.title.indexOf(filterBy) !== -1);
  }

}
