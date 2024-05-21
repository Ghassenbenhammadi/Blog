import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private authentificationservice: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    if(!this.authentificationservice.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}