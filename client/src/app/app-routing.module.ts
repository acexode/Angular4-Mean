import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';


import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from "./components/login/login.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { AuthGuard } from "./guards/auth-guard";
import { notAuthGuard } from "./guards/notAuth-guard";
import { BlogComponent } from "./components/blog/blog.component";
import { EditComponent } from "./components/blog/edit/edit.component";


const appRoutes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [notAuthGuard]
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [notAuthGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'blog', 
    component: BlogComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'edit/:id', 
    component: EditComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    component: HomeComponent 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}