import { Answer } from './answer.model';

export class AnswerResult extends Answer{

  result: number;

  constructor(ordinal: string, answer: string, result: number) {
    super(ordinal, answer);
    this.result = result;
  }
}
