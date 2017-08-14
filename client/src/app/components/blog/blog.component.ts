import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators }            from '@angular/forms';
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
  form
  newPost = false
  loadingPage = false
  likes = 0
  dislikes = 0
  processing = false
  allBlogs
  username
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    // private router: Router
  ) { 
    this.createForm();
  }
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
  addLike(){
    this.likes+=1
  }
  addDislike(){
    this.dislikes+=1
  }
  reloadBlog(){
    this.loadingPage = true
    this.getBlogs()
    setTimeout(()=>{
      this.loadingPage = false
    },4000)
  }
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
  getBlogs(){
    this.blogService.getBlogs().subscribe(blogs =>{
      this.allBlogs = blogs.posts
    })
  }
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
  ngOnInit() {
    var user =  this.authService.getUserData()
    this.username = user.username
    console.log(this.username)
    this.getBlogs()
  }

}
