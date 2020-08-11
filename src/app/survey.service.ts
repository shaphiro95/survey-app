import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Survey } from './models/survey.model';
import { SurveyFb } from './models/survey-fb.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs/';
import { Result } from './models/result.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {

  surveyFilled = new Subject<string>();
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
          this.surveyError.next('');
          this.surveyFilled.next('Survey filled successfully!');
          setTimeout(() => {
            this.surveyFilled.next('');
          }, 3500);
        },
        (error) => {
          this.surveyError.next(error.message);
        }
      );
  }

  fetchSurvey(id: string) {
    this.http
      .get<Survey>(this.DB_URL + 'surveys/' + id + '.json')
      .pipe(
        catchError((errorRes) => {
          this.surveyError.next('Undefined error occured');
          return throwError(errorRes);
        })
      )
      .subscribe((survey: Survey) => {
        if (!survey) {
          this.surveyError.next('Cannot retrieve survey with id: ' + id);
        } else {
          this.surveyError.next('');
          this.survey.next(survey);
        }
      });
  }

  fetchSurveys() {
    this.http
      .get<SurveyFb[]>(this.DB_URL + 'surveys.json')
      .pipe(
        map((response) => {
          const surveys = [];

          for (const key of Object.keys(response)) {
            surveys.push(new SurveyFb(key, response[key]));
          }
          return surveys;
        })
      )
      .subscribe((surveys: SurveyFb[]) => {
        this.surveyError.next('');
        this.surveys.next(surveys);
      });
  }
}
