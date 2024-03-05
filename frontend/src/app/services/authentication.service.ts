import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor( private http: HttpClient) { }

  login(email:string, password:string) {
    return this.http.post<any>('/api/users/login', { email, password}).pipe(
      map((token)=> {
        console.log('token');
        localStorage.setItem('blog-token', token.access_token);
        return token;
      })
    )
  }
}
