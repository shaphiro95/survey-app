import { Component, OnInit, Input } from '@angular/core';
import { Survey } from '../models/survey.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  @Input() survey: Survey;
  @Input() surveyId: string;

  surveyForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  test() {
    console.log(this.survey);
    console.log(this.surveyId);
  }

}
