import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HealthCheckComponent } from './health-check/health-check.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { JournalComponent } from './journal/journal.component';
import { JwtInterceptor } from './auth/jwt-interceptor';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { JournalArchiveComponent } from './journal/journal-archive/journal-archive.component';
import { DreamComponent } from './dream/dream.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
@NgModule({
  declarations: [
    AppComponent,
    HealthCheckComponent,
    LoginComponent,
    SignupComponent,
    JournalComponent,
    EmailVerificationComponent,
    JournalArchiveComponent,
    DreamComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
