import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators }            from '@angular/forms';
import { LowerCasePipe } from '@angular/common';

import { AuthService } from "../../services/auth.service";
import { BlogService } from "../../services/blog.service";
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  MessageClass
  message
  color
  form
  commentform
  newPost = false
  loadingPage = false
  likes = 0
  dislikes = 0
  processing = false
  allBlogs
  username
  commentBox
  allComments  = false
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    // private router: Router
  ) { 
    this.createForm();
    this.createComment();
  }
  // new post form
  createForm(){
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        this.alphaNumeric
        
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500),
       
      ])]
      
    })
  }
  //  comment form
  createComment(){
    this.commentform = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required
      ])]
    })
  }
   disableForm(){
    this.form.controls['title'].disable()
    this.form.controls['body'].disable()
    
    }

  enableForm(){
    this.form.controls['title'].enable()
    this.form.controls['body'].enable()
    
    }

  alphaNumeric(control){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/)
    if(regExp.test(control.value)){
      return null
    }else{
      return {'alphaNumeric': true }
    }
  }

  newForm(){
    this.newPost = true
  }
  // show comments area
  Showcomments(id){
    this.blogService.getSingle(id).subscribe(blogs =>{
      if(this.commentBox != blogs.posts._id ) {
        this.commentBox = blogs.posts._id
        this.allComments = true 
        this.commentform.reset()
      } else{
        this.commentBox = '' 
        this.allComments = false 
        this.commentform.reset()
      }     
      
    })
    
  }
  // post comment
  postComment(id){
    const comments = this.commentform.get('comment').value
    this.blogService.createComment(id, comments, this.username).subscribe(data =>{
      if(!data.success){
        this.MessageClass = 'alert alert-danger'
        this.message = data.message
        
      }else{
        this.MessageClass = 'alert alert-success'
        this.message = data.message
        this.commentform.reset();
        this.commentBox = null
        this.reloadBlog()
        setTimeout(()=>{
          this.MessageClass = ''
          this.message = ''
        },3000)
        
      }
    })
    console.log(id)
    console.log(comments)
    console.log(this.username)
    
  }
 

  // on form submit
  onSubmit(){
    this.processing = true;
    this.disableForm()
    var user =  this.authService.getUserData()
    this.username = user.username
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: user.username,
    }
    this.blogService.postBlog(blog).subscribe(data =>{
      if(!data.success){
        this.MessageClass = 'alert alert-danger'
        this.message = data.message
        this.processing = false;
        this.enableForm()
      }else{
        this.MessageClass = 'alert alert-success'
        this.message = data.message
        this.getBlogs()
        setTimeout(()=>{
          this.newPost = false
          this.processing = false;
          this.MessageClass = false
          this.message = ''
          this.form.reset();
          this.enableForm()
        },2000)
      }
    })
    
  }
  // get all blogs
  getBlogs(){
    this.blogService.getBlogs().subscribe(blogs =>{
      this.allBlogs = blogs.posts
      console.log(this.allBlogs)
    })
  }
  // add like to post
  addLike(id){
    var user =  this.authService.getUserData()
    this.username = user.username
    console.log(this.username)
    this.blogService.likeBlog(id, this.username).subscribe(data =>{
      console.log(data)
      if(data.success === true){
        this.color = 'liked'
      }
      this.getBlogs()
    })
  }
   // add dislike to post
   addDislike(id){
     var user =  this.authService.getUserData()
    this.username = user.username
    this.blogService.dislikeBlog(id,this.username).subscribe(data =>{
      
      this.getBlogs()
    })
  }
   // delete blog post
  deleteBlog(id){
    this.blogService.deleteBlog(id).subscribe(res=>{
      if(!res){
        this.message = 'unable to delete blog'
        this.MessageClass = 'alert alert-info'
      }else{
        this.getBlogs()
      }
    })
  }

  goBack(){
    window.location.reload()
  }
  // on page reload
  reloadBlog(){
    this.loadingPage = true
    this.getBlogs()
    setTimeout(()=>{
      this.loadingPage = false
    },4000)
  }
  // on page load
  ngOnInit() {
    var user =  this.authService.getUserData()
    this.username = user.username
    console.log(this.username)
    this.getBlogs()
  }

}
