import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthService {
  domain = 'http://localhost:3000'
  authToken
  user
  options
  constructor(private http: Http) { }

  createHeaders(){
    this.loadToken()
    this.options = new RequestOptions({
      headers : new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    })
  }
  loadToken(){
   const token =  localStorage.getItem('token')
   this.authToken = token
   }
  registerUser(User){
    return this.http.post(this.domain + '/auth/register', User)
    .map(res => res.json())
  }
  checkUsername(username){
    return this.http.get(this.domain + '/auth/checkUsername/' +username)
    .map(res => res.json())
  }
  checkEmail(email){
    return this.http.get(this.domain + '/auth/checkEmail/'+email)
    .map(res => res.json())
  }
  login(user){
    return this.http.post(this.domain + '/auth/login', user )
    .map(res => res.json())
  }
  logOut(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    
  }

  storeUserData(token, user){
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.authToken = token;
    this.user = user;
  }
  getProfile(){
    this.createHeaders()
    return this.http.get(this.domain + '/auth/profile', this.options).map(res => res.json())
  }
  getUserData(){
    return JSON.parse(localStorage.getItem('user'));
  }
 loggedIn() {
  return tokenNotExpired();
}
  

}
