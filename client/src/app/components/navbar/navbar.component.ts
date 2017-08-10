import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { FlashMessagesService } from "angular2-flash-messages/module";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private flash: FlashMessagesService,
    private router: Router  
  
  ) { }

  onLogOut(){
    this.authService.logOut()
    this.flash.show('You are logged out', { cssClass: 'alert-info', timeout: 1000 })
    this.router.navigate(['/'])
  }
  ngOnInit() {
  }

}
