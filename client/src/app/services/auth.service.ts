import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class AuthService {
  domain = 'http://localhost:3000'
  constructor(private http: Http) { }

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

}
