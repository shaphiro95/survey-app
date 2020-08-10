import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Survey } from '../models/survey.model';
import { NgForm } from '@angular/forms';
import { SurveyAnswer } from '../models/surveyanswer.model';
import { Result } from '../models/result.model';
import { SurveyService } from '../survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  @Input() survey: Survey;
  @Input() surveyId: string;

  @ViewChild('surveyForm') surveyForm: NgForm;

  constructor(private surveyService: SurveyService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.surveyForm.value);
    const answers = [];

    for (const key of Object.keys(this.surveyForm.value)) {
      answers.push(new SurveyAnswer(+key, this.surveyForm.value[key]));
    }

    const result = new Result(this.surveyId, answers);

    this.surveyService.fillSurvey(result);
  }
}
