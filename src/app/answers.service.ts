import { Answer } from './models/answer.model';
import { Survey } from './models/survey.model';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Subject, throwError } from 'rxjs/';
import { Injectable } from '@angular/core';
import { SurveyResult } from './models/survey-result.model';
import { AnswerResult } from './models/answer-result.model';
import { QuestionResult } from './models/question-result.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AnswersService {

  surveyResult = new Subject<SurveyResult>();
  errorSub = new Subject<string>();
  survey: Survey;

  private DB_URL = 'https://survey-94d17.firebaseio.com/';

  constructor(private http: HttpClient) {}

  fetchResult(surveyId: string) {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('orderBy', '"surveyId"');
    searchParams = searchParams.append('equalTo', '"' + surveyId + '"');

    this.http
      .get<any>(this.DB_URL + 'answers.json', { params: searchParams })
      .pipe(
        map((response) => {
          if (Object.keys(response).length === 0) {
            return null;
          }

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
          let answered = 0;
          for (const key of Object.keys(grouped)) {
            const ansRes: AnswerResult[] = [];
            for (const [ans, score] of Object.entries(grouped[key])) {
              ansRes.push(new AnswerResult(ans, null, +score));
              answered += +score;
            }
            questRes.push(new QuestionResult(+key, ansRes));
          }

          answered = answered / Object.keys(grouped).length;

          return this.prepareResult(new SurveyResult(answered, questRes));
        }), catchError((errorRes) => {
          if (errorRes.error.error) {
            this.errorSub.next(errorRes.error.error);
          } else {
            this.errorSub.next('Undefined error occured.');
          }
          return throwError(errorRes);
        })
      )
      .subscribe((result) => {
        this.errorSub.next('');
        this.surveyResult.next(result);
      });
  }

  prepareResult(result: SurveyResult): SurveyResult {
    if (!this.survey || !result) {
      return null;
    }

    result.title = this.survey.title;

    for (const survQuestion of this.survey.questions) {
      for (const resQuestion of result.questions) {
        if (resQuestion.ordinal === survQuestion.ordinal) {
          resQuestion.question = survQuestion.question;
          resQuestion.answers = this.prepareAnswers(
            survQuestion.answers,
            resQuestion.answers
          );
        }
      }
    }

    return result;
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
