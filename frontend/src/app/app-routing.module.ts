import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'; // Adjust
import { DashboardComponent } from './components/dashboard/dashboard.component'; // Adjust path if needed
import { AuthGuard } from './guards/auth.guard';  
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'; // Adjust path
import { SignupComponent } from './components/signup/signup.component'; // Adjust path


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] // Protect this route with the AuthGuard
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route

  // Wildcard route for a 404 page - THIS MUST BE THE LAST ROUTE IN THE CONFIGURATION
  { path: '**', component: PageNotFoundComponent}, // Create PageNotFoundComponent if you want this

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
