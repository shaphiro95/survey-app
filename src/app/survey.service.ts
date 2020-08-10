import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Survey } from './models/survey.model';
import { SurveyFb } from './models/survey-fb.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs/';
import { Result } from './models/result.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  error = new Subject<string>();
  surveyError = new Subject<string>();
  survey = new Subject<Survey>();
  surveys = new Subject<SurveyFb[]>();
  newSurveyId = new Subject<string>();

  private DB_URL = 'https://survey-94d17.firebaseio.com/';

  constructor(private http: HttpClient) {}

  createSurvey(survey: Survey) {
    this.http
      .post<{ name: string }>(this.DB_URL + 'surveys.json', survey, {
        observe: 'response',
        responseType: 'json',
      })
      .subscribe(
        (responseData) => {
          this.error.next('');
          this.newSurveyId.next(responseData.body.name);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fillSurvey(survey: Result) {
    this.http
      .post<{ name: string }>(this.DB_URL + 'answers.json', survey, {
        observe: 'response',
        responseType: 'json',
      })
      .subscribe(
        () => {
          this.error.next('');
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  getSurvey(id: string) {
    return this.http.get<Survey>(this.DB_URL + 'surveys' + id + '.json').pipe(
      map((response) => {
        this.survey.next(response);
      }),
      catchError((errorRes) => {
        this.error.next('Unknown error occurred');
        return throwError(errorRes);
      })
    );
  }

  fetchSurveys() {
    return this.http.get<SurveyFb[]>(this.DB_URL + 'surveys.json').pipe(
      map((response) => {
        this.surveys.next(response);
      }),
      catchError((errorRes) => {
        this.surveyError.next('Unknown error occurred');
        return throwError(errorRes);
      })
    );
  }
}
