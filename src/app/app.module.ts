import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NewSurveyComponent } from './new-survey/new-survey.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SurveyComponent } from './survey/survey.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SurveyResultComponent } from './survey-result/survey-result.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewSurveyComponent,
    SurveyComponent,
    SurveyListComponent,
    PageNotFoundComponent,
    SurveyResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
