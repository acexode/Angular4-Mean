import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { AuthGuard } from "../../guards/auth-guard";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  message;
  MessageClass;
  processing = false
  previousUrl
  
  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private authGuard: AuthGuard 
  ) {
    this.createForm()
   }

  createForm(){
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  enableForm(){
    this.form.controls['username'].enable()
    this.form.controls['password'].enable()
  }
  disableForm(){
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }
  onLogin(){
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }
    this.authService.login(user).subscribe(data =>{
      if(!data.success){
        this.MessageClass = 'alert alert-danger'
        this.message = data.message
        this.processing = false
        this.enableForm()
      }else{
        this.MessageClass = 'alert alert-success'
        this.message = data.message
        this.authService.storeUserData(data.token, data.user)
        setTimeout(()=>{
          if(this.previousUrl){
            this.router.navigate([this.previousUrl])
          }else{
            this.router.navigate(['/dashboard'])
          }
        },2000)
      }
    })
  }
  //  logOut(){
  //     this.authService.logout()
  //   }
  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.MessageClass = 'alert alert-danger'
      this.message = 'You are not logged in'
      this.previousUrl = this.authGuard.redirectUrl
      this.authGuard.redirectUrl = undefined
    }
  }

}
