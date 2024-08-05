import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { WlcComponent } from './wlc/wlc.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { WorkLoadTableComponent } from './work-load-table/work-load-table.component';
import { ChartModule } from 'angular-highcharts';
import { ChartsComponent } from './charts/charts.component';
import { AdminChartsComponent } from './admin-charts/admin-charts.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { StatsComponent } from './stats/stats.component';
import { PermetionComponent } from './permetion/permetion.component';
import { CookieService } from './cookie.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: WlcComponent },
  { path: 'Shedule', component: HomeComponent },
  { path: 'Stats', component: StatsComponent },
  { path: 'Admin', component: AdminComponent },
  { path: 'LogIn', component: LoginComponent },
  { path: 'SignUp', component: SigninComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SigninComponent,
    WlcComponent,
    ScheduleComponent,
    WorkLoadTableComponent,
    ChartsComponent,
    AdminChartsComponent,
    HomeComponent,
    AdminComponent,
    StatsComponent,
    PermetionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ChartModule,
    RouterModule.forRoot(routes),
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
