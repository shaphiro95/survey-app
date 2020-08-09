import { Question } from './question.model';

export interface Survey {
  id: string;
  title: string;
  questions: Question[];
}
