import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { BlogService } from "../../../services/blog.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  MessageClass
  message
  form
  blog
  processing = false
  currentUrl
  loading = true;
  username
  constructor( 
    private formBuilder: FormBuilder, 
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService,
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
  alphaNumeric(control){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/)
    if(regExp.test(control.value)){
      return null
    }else{
      return {'alphaNumeric': true }
    }
  }
  onUpdate(){
    var user =  this.authService.getUserData()
    this.username = user.username
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: user.username,
    }
     this.blogService.updateBlog(this.currentUrl.id,blog).subscribe(data =>{
       if(!data.success){
        this.MessageClass = 'alert alert-danger'
        this.message = data.message
        this.processing = false;
        console.log(data)
      }else{
        this.MessageClass = 'alert alert-success'
        this.message = data.message
        
        setTimeout(()=>{
          
          this.router.navigate(['/blog'])
          
        },2000)
      }
     })
  }
  
  goBack(){
    this.location.back()
  }
  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params
    this.blogService.getSingle(this.currentUrl.id).subscribe(res =>{
      if(!res.posts){
        this.message = 'post not found'
        this.MessageClass = 'alert alert-danger'
        
      }else{
          console.log(res)
          this.blog = res.posts
          this.loading = false
      }
    })
  }


}
