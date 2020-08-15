import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../survey.service';
import { Subscription } from 'rxjs';
import { SurveyFb } from '../models/survey-fb.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css'],
})
export class SurveyListComponent implements OnInit, OnDestroy {

  surveyFilledSub: Subscription;
  surveysSub: Subscription;
  surveyErrorSub: Subscription;

  surveyFilled: string;
  surveys: SurveyFb[];
  surveyError: string;

  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.surveyService.fetchSurveys();
    this.surveysSub = this.surveysSub = this.surveyService.surveys.subscribe(
      (surveys) => {
        this.surveys = surveys;
      }
    );
    this.surveyFilledSub = this.surveyService.surveyFilled.subscribe(
      (filled) => {
        this.surveyFilled = filled;
      }
    );
    this.surveyErrorSub = this.surveyService.surveyError.subscribe(
      (error: string) => {
        this.surveyError = error;
      }
    );
  }

  fillSurvey(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  showResults(id: string) {
    this.router.navigate([id, 'result'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.surveysSub.unsubscribe();
    this.surveyFilledSub.unsubscribe();
    this.surveyErrorSub.unsubscribe();
  }
}
