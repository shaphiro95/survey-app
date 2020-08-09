import { Survey } from './../models/survey.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { jsonValidator } from '../utils/json.validator';
import * as Ajv from 'ajv';
import { HttpClient } from '@angular/common/http';
import { SurveyService } from '../survey.service';

@Component({
  selector: 'app-new-survey',
  templateUrl: './new-survey.component.html',
  styleUrls: ['./new-survey.component.css'],
})
export class NewSurveyComponent implements OnInit {
  @ViewChild('btnExample') exampleBtn: ElementRef;

  surveyForm: FormGroup;
  jsonFormObject: any;
  isExampleVisible = false;
  isValid: any;
  schemaErrors;

  constructor(private http: HttpClient, private surveyService: SurveyService) {}

  ngOnInit(): void {
    const schemaURL = `assets/schemas/survey.json`;
    this.http
      .get(schemaURL, { responseType: 'text' })
      .subscribe(schema => {
        this.jsonFormObject = JSON.parse(schema);
      });
    this.initForm();
  }

  initForm() {
    this.surveyForm = new FormGroup({
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

    if (this.surveyForm.status !== 'VALID') {
      return;
    }

    const survey = JSON.parse(this.surveyForm.value.survey);

    this.validateBySchema(survey);

    if (!this.isValid) {
      return;
    }

    this.surveyService.createSurvey(survey);
  }

  onShow(): void {

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

}
