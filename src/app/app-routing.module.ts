import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewSurveyComponent } from './new-survey/new-survey.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SurveyComponent } from './survey/survey.component';
import { SurveyResultComponent } from './survey-result/survey-result.component';


const routes: Routes = [
  { path: '',   redirectTo: '/survey', pathMatch: 'full' },
  { path: 'new', component: NewSurveyComponent },
  { path: 'survey', component: SurveyListComponent, children: [
    {path: ':id', component: SurveyComponent},
    {path: ':id/result', component: SurveyResultComponent}
  ]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
