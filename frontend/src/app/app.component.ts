import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

entires = [
 {
  name: 'Login',
  link: 'login'
 },
 {
  name: 'Register',
  link: 'register'
 },
 {
  name: 'Update profile',
  link: 'update-profile'
 }
];


  constructor(private router:Router){}


navigateTo(value:any){
  this.router.navigate(['../',value]);

  }
}
