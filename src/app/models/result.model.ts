import { SurveyAnswer } from './surveyanswer.model';

export class Result {
  surveyId: string;
  result: SurveyAnswer[];

  constructor(surveyId: string, result: SurveyAnswer[]) {
    this.surveyId = surveyId;
    this.result = result;
  }
}
