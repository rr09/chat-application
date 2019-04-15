import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ChatRouteGuardService implements CanActivate{

  constructor(private router:Router,private Cookie:CookieService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('In guard service');
    if (this.Cookie.get('authtoken')===undefined || this.Cookie.get('authtoken') === '' ||  this.Cookie.get('authtoken') === null ) {
      this.router.navigate(['/']);
      return false;
    }

    else{
      return true;
    }
  }
}
