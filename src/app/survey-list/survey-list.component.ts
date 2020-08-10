import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../survey.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit, OnDestroy {

  surveysSub: Subscription;

  constructor(private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.surveyService.fetchSurveys();
    this.surveysSub = this.surveyService.surveys.subscribe(
      (surveys) => {
        console.log(surveys);
      }
    );
  }

  ngOnDestroy(): void {

  }
}
