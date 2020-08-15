import { Answer } from './answer.model';

export class Question {

  ordinal: number;
  question: string;
  answers: Answer[];

  constructor(question: string, answers: Answer[]) {
    this.question = question;
    this.answers = answers;
  }
}
