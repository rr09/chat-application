import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from './../../app.service';
import {ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(public appService:AppService, public router:Router,private toastr:ToastrService,private cookieService:CookieService) { }

  ngOnInit() {
  }
  
    public signinFunction:any= () => {
      if (!this.email) {
        this.toastr.warning ('Enter the email')
      }

      else if (!this.password) {
        this.toastr.warning ('Enter the password')
      }
      
      else {
        let data = {
          email: this.email,
          password:this.password
        }

        this.appService.signinFunction (data)
        .subscribe((apiResponse) => {
          if(apiResponse.status ===200) {
            console.log (apiResponse);
          this.toastr.success('Login Successful')
          this.cookieService.set('authtoken', apiResponse.data.authToken);
          this.cookieService.set('receiverId', apiResponse.data.userDetails.userId);
          this.cookieService.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          this.appService.setUserInfoLocalStorage(apiResponse.data.userDetails); 
          //console.log(apiResponse.data.userDetails);
          this.router.navigate(['/chat']);
          }
          else {
              this.toastr.error(apiResponse.message)
          }
        
      
        }, (err)=> {
            this.toastr.error('some error occured');
          }
        );
      }
    } 

    public goToSignUp:any = ()=> {
      this.router.navigate(['/sign-up']);
  }
}

