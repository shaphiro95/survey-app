import { Question } from "./question.model";

export class Survey {
  id: string;
  questions: Question[];

  constructor(id: string, questions: Question[]) {
    this.id = id;
    this.questions = questions;
  }
}
