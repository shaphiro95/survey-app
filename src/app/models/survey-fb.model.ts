import { Survey } from './survey.model';

export class SurveyFb {
  id: string;
  survey: Survey;

  constructor(id: string, survey: Survey) {
    this.id = id;
    this.survey = survey;
  }
}
