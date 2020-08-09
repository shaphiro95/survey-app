import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from '@angular/common/http';
import { Survey } from './models/survey.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs/';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {

  error = new Subject<string>();

  private DB_URL = 'https://survey-94d17.firebaseio.com/';

  constructor(private http: HttpClient) {}

  createSurvey(survey: Survey) {
    this.http
      .post<{ name: string }>(
        this.DB_URL + 'surveys.json',
        survey,
        {
          observe: 'response',
          responseType: 'json'
        }
      )
      .subscribe(
        (responseData) => {
          return responseData;
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }
}
