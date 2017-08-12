import { Injectable } from '@angular/core';
import { Http, RequestOptions,Headers } from "@angular/http";
import { AuthService } from "./auth.service";

@Injectable()
export class BlogService {

  domain = this.authService.domain
  
  options
  constructor(private http: Http, private authService: AuthService) { }

  createHeaders(){
    this.authService.loadToken()
    this.options = new RequestOptions({
      headers : new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    })
  }
  postBlog(blog){
    this.createHeaders()
    return this.http.post(this.domain+'blog/newBlog',blog, this.options).map(res => res.json())

  }
  getBlogs(){
    this.createHeaders()
    return this.http.get(this.domain+'blog/post', this.options).map(res => res.json())
  }

}
