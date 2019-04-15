import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import{RouterModule, Routes} from '@angular/router';

import { ChatBoxComponent } from './chat-box/chat-box.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared.module';
import { RemoveSpecialCharPipe } from '../shared/pipes/remove-special-char.pipe';
import { FirstCharComponent } from '../shared/first-char/first-char.component';
import { UserDetailsComponent } from '../shared/user-details/user-details.component';
import {ChatRouteGuardService} from './chat-route-guard.service'




@NgModule({
  declarations: [ChatBoxComponent, RemoveSpecialCharPipe],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SharedModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {path:'chat', component:ChatBoxComponent, canActivate: [ChatRouteGuardService]}
    
    ])
    
  ],
  providers: [ChatRouteGuardService]
  
})
export class ChatModule { }
