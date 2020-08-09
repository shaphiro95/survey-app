import { Survey } from './../models/survey.model';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { jsonValidator } from '../utils/json.validator';
import * as Ajv from 'ajv';
import { HttpClient } from '@angular/common/http';
import { SurveyService } from '../survey.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-survey',
  templateUrl: './new-survey.component.html',
  styleUrls: ['./new-survey.component.css'],
})
export class NewSurveyComponent implements OnInit, OnDestroy {
  @ViewChild('btnExample') exampleBtn: ElementRef;

  private errorSub: Subscription;
  private idSub: Subscription;

  newSurveyForm: FormGroup;
  jsonFormObject: any;
  isExampleVisible = false;
  isValid: any;
  schemaErrors: any;
  firebaseError: string;
  newSurvey: Survey;
  newSurveyId: string;

  constructor(private http: HttpClient, private surveyService: SurveyService) {}

  ngOnInit(): void {
    const schemaURL = `assets/schemas/survey.json`;
    this.http
      .get(schemaURL, { responseType: 'text' })
      .subscribe(schema => {
        this.jsonFormObject = JSON.parse(schema);
      });
    this.errorSub = this.surveyService.error.subscribe(
      (error) => {
        this.firebaseError = error;
      }
    );
    this.idSub = this.surveyService.newSurveyId.subscribe(
      (surveyId) => {
        this.newSurveyId = surveyId;
      }
    );
    this.initForm();
  }

  initForm() {
    this.newSurveyForm = new FormGroup({
      survey: new FormControl('', Validators.compose([Validators.required, jsonValidator])),
    });
  }

  showExample(): void {
    this.isExampleVisible = !this.isExampleVisible;
    this.exampleBtn.nativeElement.innerText = this.isExampleVisible
      ? 'Hide Example'
      : 'Show Example';
  }

  onSubmit(): void {

    this.firebaseError = '';

    if (this.newSurveyForm.status !== 'VALID') {
      return;
    }

    const survey = JSON.parse(this.newSurveyForm.value.survey);

    this.validateBySchema(survey);
    if (!this.isValid) {
      return;
    }
    this.surveyService.createSurvey(survey);

    this.newSurvey = survey;
  }

  validateBySchema(data): void {
    const ajv = new Ajv();
    const validate = ajv.compile(this.jsonFormObject);
    this.isValid = validate(data);
    this.schemaErrors = validate.errors;
  }

  copyInputMessage(inputElement){
    const listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (inputElement.value));
        e.preventDefault();
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
    this.idSub.unsubscribe();
  }
}
