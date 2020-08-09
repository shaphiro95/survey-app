import { Survey } from './../models/survey.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { jsonValidator } from '../utils/json.validator';

@Component({
  selector: 'app-new-survey',
  templateUrl: './new-survey.component.html',
  styleUrls: ['./new-survey.component.css'],
})
export class NewSurveyComponent implements OnInit {
  @ViewChild('btnExample') exampleBtn: ElementRef;

  surveyForm: FormGroup;

  isExampleVisible = false;

  constructor() {}

  ngOnInit(): void {
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
    if(this.surveyForm.status !== 'VALID') {
      return;
    }

    const survey: Survey  = JSON.parse(this.surveyForm.value.survey);
    console.log(survey);
  }

  onShow(): void {

  }
}
