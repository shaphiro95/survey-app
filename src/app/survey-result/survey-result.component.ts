import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnswersService } from '../answers.service';
import { SurveyResult } from '../models/survey-result.model';
import { Survey } from '../models/survey.model';
import { SurveyService } from '../survey.service';

@Component({
  selector: 'app-survey-result',
  templateUrl: './survey-result.component.html',
  styleUrls: ['./survey-result.component.css'],
})
export class SurveyResultComponent implements OnInit, OnDestroy {
  surveyId: string;
  resultSub: Subscription;
  surveySub: Subscription;
  result: SurveyResult;
  survey: Survey;
  paramsSub: Subscription;

  constructor(
    private answerService: AnswersService,
    private surveyService: SurveyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe((params: Params) => {
      this.surveyId = params['id'];
      this.prepareData();
    });
    this.surveySub = this.surveyService.survey.subscribe((survey: Survey) => {
      this.survey = survey;
      this.answerService.getResult(this.surveyId, this.survey);
    });
    this.resultSub = this.answerService.surveyResult.subscribe(
      (result: SurveyResult) => {
        this.result = result;
      }
    );
  }

  prepareData(): void {
    this.surveyService.fetchSurvey(this.surveyId);
  }

  fill() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.resultSub.unsubscribe();
    this.surveySub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}
