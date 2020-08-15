import { AnswerResult } from './answer-result.model';

export class QuestionResult {

  ordinal: number;
  question: string;
  answers: AnswerResult[];

  constructor(ordinal: number, answers: AnswerResult[]) {
    this.ordinal = ordinal;
    this.answers = answers;
  }
}
