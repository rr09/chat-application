import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

//routing
import{RouterModule, Routes} from '@angular/router';

//cookie
import { CookieService } from 'ngx-cookie-service';
//toast
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

//features modules
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';

import { LoginComponent } from './user/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AppService } from './app.service';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    FormsModule,
    UserModule,
    ChatModule,
    SharedModule,
    RouterModule.forRoot([
      {path: 'login',component: LoginComponent, pathMatch: 'full'},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '*', component: LoginComponent},
      {path: '**', component:LoginComponent} 
    ])
  ],
  providers: [CookieService,AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
