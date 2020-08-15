import { Answer } from './models/answer.model';
import { Survey } from './models/survey.model';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/';
import { Injectable } from '@angular/core';
import { SurveyResult } from './models/survey-result.model';
import { AnswerResult } from './models/answer-result.model';
import { QuestionResult } from './models/question-result.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AnswersService {
  result: SurveyResult;
  surveyResult = new Subject<SurveyResult>();

  private DB_URL = 'https://survey-94d17.firebaseio.com/';

  constructor(private http: HttpClient) {}

  fetchResult(surveyId: string) {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('orderBy', '"surveyId"');
    searchParams = searchParams.append('equalTo', '"' + surveyId + '"');

    this.http
      .get<SurveyResult>(this.DB_URL + 'answers.json', { params: searchParams })
      .pipe(
        map((response) => {
          const results = [];

          for (const key of Object.keys(response)) {
            results.push(response[key].result);
          }

          const merged = [].concat.apply([], results);
          const grouped = this.groupBy(merged, 'question');

          for (const key of Object.keys(grouped)) {
            grouped[key] = grouped[key].reduce((sum, it) => {
              sum[it.answer] = sum[it.answer] + 1 || 1;
              return sum;
            }, {});
          }

          const questRes: QuestionResult[] = [];
          let answered: number = 0;
          for (const key of Object.keys(grouped)) {
            const ansRes: AnswerResult[] = [];
            for (const [ans, score] of Object.entries(grouped[key])) {
              ansRes.push(new AnswerResult(ans, null, +score));
              answered += +score;
            }
            questRes.push(new QuestionResult(+key, ansRes));
          }

          answered = answered / Object.keys(grouped).length;

          return new SurveyResult(answered, questRes);
        })
      )
      .subscribe((result) => {
        this.result = result;
      });
  }

  getResult(surveyId: string, survey: Survey) {
    this.fetchResult(surveyId);
    this.prepareResult(survey, this.result);
  }

  prepareResult(survey: Survey, result: SurveyResult) {

    if ( !survey || !result) {
      return;
    }

    result.title = survey.title;

    for (const survQuestion of survey.questions) {
      for (const resQuestion of result.questions) {
        if (resQuestion.ordinal === survQuestion.ordinal) {
          resQuestion.question = survQuestion.question;
          resQuestion.answers = this.prepareAnswers(survQuestion.answers, resQuestion.answers);
        }
      }
    }
    this.surveyResult.next(result);
  }

  prepareAnswers(survAns: Answer[], resAns: AnswerResult[]): AnswerResult[] {

    const answers: AnswerResult[] = [];

    for (const survAnswer of survAns) {
      const ansRes = new AnswerResult(survAnswer.ordinal, survAnswer.answer, 0);
      answers.push(ansRes);
    }

    for (const answer of answers) {
      for (const resAnswer of resAns) {
        if (answer.ordinal === resAnswer.ordinal) {
          answer.result = resAnswer.result;
        }
      }
    }

    return answers;
  }

  groupBy(array, key) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  }
}
