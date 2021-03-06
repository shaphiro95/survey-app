import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnswersService } from '../answers.service';
import { SurveyResult } from '../models/survey-result.model';

@Component({
  selector: 'app-survey-result',
  templateUrl: './survey-result.component.html',
  styleUrls: ['./survey-result.component.css'],
})
export class SurveyResultComponent implements OnInit, OnDestroy {
  surveyId: string;
  resultSub: Subscription;
  errorSub: Subscription;
  result: SurveyResult;
  error: string;

  constructor(
    private answerService: AnswersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.surveyId = params.id;
      this.answerService.fetchResult(this.surveyId);
    });
    this.resultSub = this.answerService.surveyResult.subscribe(
      (result: SurveyResult) => {
        this.result = result;
      }
    );
    this.errorSub = this.answerService.errorSub.subscribe(
      (error: string) => {
        this.error = error;
      }
    );
  }

  fill() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.resultSub.unsubscribe();
  }
}
