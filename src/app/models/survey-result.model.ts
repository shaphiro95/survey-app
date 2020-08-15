import { QuestionResult } from './question-result.model';

export class SurveyResult {
  title: string;
  questions: QuestionResult[];
  answered: number;

  constructor(answered: number, questions: QuestionResult[]) {
    this.questions = questions;
    this.answered = answered;
  }
}
