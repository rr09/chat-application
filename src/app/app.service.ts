import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse,HttpParams} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AppService {
  
  private url = 'https://chatapi.edwisor.com';
  private authToken;
  
  constructor(public http:HttpClient, public cookieService:CookieService) { } 
  
  public getUserInfoFromLocalstorage = () => {
    return JSON.parse (localStorage.getItem ('userInfo'));  // to use the user data from local storage
  }  

  public setUserInfoLocalStorage = (data) => {
    localStorage.setItem ('userInfo', JSON.stringify(data))
  }

  public signupFunction (data):Observable <any> {
    const params = new HttpParams()
    .set ('firstName', data.firstName)
    .set ('lastName', data.lastName)
    .set('mobile', data.mobile)
    .set('email', data.email)
    .set('password',data.password)
    .set ('apiKey', data.apiKey);
   
    return this.http.post (`${this.url}/api/v1/users/signup`,params);
  
  }

  public signinFunction (data): Observable<any> {
    const params = new HttpParams()
    .set ('email', data.email)
    .set ('password',data.password);
    console.log(params);
    return this.http.post(`${this.url}/api/v1/users/login`,params);
  }

   public unseenChatUserList (data):Observable <any> {
    console.log(data);
    this.authToken = this.cookieService.get('authtoken');
    console.log(this.authToken);
    let url = this.http.get(this.url+'/api/v1/chat/unseen/user/list?authToken='+ '${this.authToken}&userId=${data}');  

      return this.http.get(`${this.url}/api/v1/chat/unseen/user/list?authToken=${this.authToken}&userId=${data}`);
    
  } 

  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authtoken'))

    return this.http.post(`${this.url}/api/v1/users/logout`, params);

  }
  
  
}

