import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';

export interface LoginForm {
  email: string;
  password: string;
}
export const JWT_NAME = 'blog-token';

export interface User {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  profileImage?: string;
  // passwordConfirm?:string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor( private http: HttpClient, private jwtHelper: JwtHelperService) { }

  login(loginForm: LoginForm) {
    return this.http.post<any>('/api/users/login', { email: loginForm.email, password: loginForm.password}).pipe(
      map((token)=> {
        localStorage.setItem(JWT_NAME, token.access_token);
        return token;
      })
    );
  }
  
  register(user: User) {
    return this.http.post<any>('/api/users', user).pipe(
      map( user => user)
    );
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUserId(): Observable<number> {
    return of(localStorage.getItem(JWT_NAME)).pipe(
      switchMap((jwt: string | null) => {
        if (jwt) {
          return of(this.jwtHelper.decodeToken(jwt)).pipe(
            map((jwt: any) => jwt.user.id)
          );
        } else {
          return throwError('JWT not found in localStorage');
        }
      })
    );
  } 

}
