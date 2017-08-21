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
  getSingle(id){
    this.createHeaders()
    return this.http.get(this.domain+'blog/post/'+id, this.options).map(res => res.json())
  }
  updateBlog(id, blog){
    this.createHeaders()
    return this.http.put(this.domain+'blog/post/'+id,blog, this.options).map(res => res.json())
  }
  deleteBlog(id){
    this.createHeaders()
    return this.http.delete(this.domain+'blog/post/'+id, this.options).map(res => res.json())
  }
  likeBlog(id, username){
    const blogData = { id: id, username: username}
    this.createHeaders()
    return this.http.put(this.domain+'blog/like/', blogData, this.options).map(res => res.json())
  }
  dislikeBlog(id,username){
    const blogData = { id: id, username: username}
    this.createHeaders()
    return this.http.put(this.domain+'blog/dislike/', blogData, this.options).map(res => res.json())
  }

  createComment(id, comment, username){
    const comments = {id: id, comment: comment, username: username}
    this.createHeaders
    return this.http.post(this.domain+'blog/comments/', comments, this.options).map(res=> res.json())
  }

}
