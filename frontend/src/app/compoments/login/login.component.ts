import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  constructor(private authService:AuthenticationService){}
  
  ngOnInit(){
  } 

  login(){
    this.authService.login( 'amin@hmail.com','amin123').subscribe( 
      data => console.log('success')
      
    )
  }

}
