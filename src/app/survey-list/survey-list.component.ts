import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../survey.service';
import { Subscription } from 'rxjs';
import { SurveyFb } from '../models/survey-fb.model';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit, OnDestroy {

  surveysSub: Subscription;
  surveys: SurveyFb[];

  constructor(private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.surveyService.fetchSurveys();
    this.surveysSub = this.surveysSub = this.surveyService.surveys.subscribe(
      (surveys) => {
        this.surveys = surveys;
      }
    );
  }

  ngOnDestroy(): void {
    this.surveysSub.unsubscribe();
  }
}
