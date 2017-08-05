import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup
  
  constructor(private formBuilder: FormBuilder) { 
    this.createForm();
  }
  createForm(){
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUser
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, {validator: this.MatchingPasswords('password', 'confirm') });
  }
  onRegister(){
    console.log(this.form.controls)
  }
  validateEmail(control){
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if(regExp.test(control.value)){
      return null
    }else{
      return {'validateEmail': true }
    }
  }
  validateUser(control){
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/)
    if(regExp.test(control.value)){
      return null
    }else{
      return {'validateUser': true }
    }
  }
  validatePassword(control){
    const regExp = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,35}$/)
    if(regExp.test(control.value)){
      return null
    }else{
      return {'validatePassword': true }
    }
  }

  MatchingPasswords(password,confirm){
    return (group: FormGroup) =>{
      if(group.controls[password].value === group.controls[confirm].value){
        return null
      }else{
        return {'MatchingPasswords': true}
      }
    }

  }
  ngOnInit() {
  }

}
