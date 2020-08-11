import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Survey } from '../models/survey.model';
import { NgForm } from '@angular/forms';
import { SurveyAnswer } from '../models/surveyanswer.model';
import { Result } from '../models/result.model';
import { SurveyService } from '../survey.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
})
export class SurveyComponent implements OnInit, OnDestroy {
  @Input() survey: Survey;
  @Input() surveyId: string;

  surveySub: Subscription;
  surveyErrorSub: Subscription;
  surveyError: string;

  @ViewChild('surveyForm') surveyForm: NgForm;

  constructor(
    private surveyService: SurveyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.surveyErrorSub = this.surveyService.surveyError.subscribe(
      (error: string) => {
        this.surveyError = error;
      }
    );

    if (!this.survey) {
      this.route.params.subscribe((params: Params) => {
        this.surveyId = params['id'];
        this.surveyService.fetchSurvey(this.surveyId);
        this.surveySub = this.surveyService.survey.subscribe(
          (survey: Survey) => {
            this.survey = survey;
          }
        );
      });
    }
  }

  onSubmit() {
    const answers = [];

    for (const key of Object.keys(this.surveyForm.value)) {
      answers.push(new SurveyAnswer(+key, this.surveyForm.value[key]));
    }

    const result = new Result(this.surveyId, answers);

    this.surveyService.fillSurvey(result);
  }

  ngOnDestroy() {
    if (this.surveySub) {
      this.surveySub.unsubscribe();
    }
    this.surveyErrorSub.unsubscribe();
  }
}
