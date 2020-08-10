import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewSurveyComponent } from './new-survey/new-survey.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '',   redirectTo: '/survey', pathMatch: 'full' },
  { path: 'new', component: NewSurveyComponent },
  { path: 'survey', component: SurveyListComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
