import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username
  email
  constructor( private authService: AuthService) { 
   
  }
  
  
  ngOnInit() {
    var user =  this.authService.getUserData()
    this.email = user.email
    this.username = user.username
    // this.authService.getProfile().subscribe(profile =>{
    //   this.username = profile.user.username
    //   this.email = profile.user.email
    // })
         
  }


}
