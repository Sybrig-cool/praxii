import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { JournalComponent } from './journal/journal.component';
import { JournalArchiveComponent } from './journal/journal-archive/journal-archive.component';
import { DreamComponent } from './dream/dream.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verify-email', component: EmailVerificationComponent },
  { path: 'dashboard', component: JournalComponent },
  { path: 'archive', component: JournalArchiveComponent },
  { path: 'dreams', component: DreamComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
