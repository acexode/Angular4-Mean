import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';  // <-- #1 import module
import { FlashMessagesModule } from 'angular2-flash-messages';
import {CKEditorModule} from 'ng2-ckeditor';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from "./components/profile/profile.component";
import { AuthGuard } from "./guards/auth-guard";
import { notAuthGuard } from "./guards/notAuth-guard";
import { BlogComponent } from "./components/blog/blog.component";
import { BlogService } from "./services/blog.service";
import { EditComponent } from "./components/blog/edit/edit.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    EditComponent
   
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpModule,
    FlashMessagesModule,
    FormsModule,
    CKEditorModule
  ],
  providers: [AuthService, BlogService, AuthGuard,notAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
