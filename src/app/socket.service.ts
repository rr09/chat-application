import { Injectable } from '@angular/core';

import io from 'socket.io-client';

import { Observable } from 'rxjs'
import { CookieService } from 'ngx-cookie-service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'https://chatapi.edwisor.com';
  private socket;

  constructor(public http: HttpClient, public cookieService:CookieService) {
    this.socket = io(this.url);    //Connection/ handshake  between the client and the server being created. 
  }

  //events to be listened

  public verifyUser = () => {
    
    return Observable.create((observer) => {
         console.log(observer);

      // Listening to the event
      
      this.socket.on('verifyUser', (data) => {
        
        observer.next(data); // sends the data to the subscribers
      }); // end Socket

    });  // end Observable
  } // end verifyUser

  public onlineUserList  = () =>{
    
    return Observable.create((observer) =>{
      
      this.socket.on ('online-user-list', (userList) => { 
        console.log(userList);
        
        
          observer.next(userList)
         
          
      }); // end socket

    }); // end Observable
  } // end onlineUserList

  


  public disconnectedSocket = () =>{
     return Observable.create((observer) => {     
       this.socket.on ('Disconnect', () =>{
         observer.next()
       });  // end socket

     }); // end Observable

     
  } // end disconnectSocket


   //events to be emitted

  public setUser = (authToken) => {
    
    this.socket.emit ('set-user', authToken);
    
  } // end setUser

  public markChatAsSeen = (userDetails) => {
    
    this.socket.emit('mark-chat-as-seen', userDetails);
  }

  public getChat(senderId, receiverId, skip): Observable<any> {

    return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${this.cookieService.get('authtoken')}`)
      .do(data => console.log('Data Received'))
      .catch(this.handleError);

  }


  
  public SendChatMessage = (chatMsgObject) => {
    this.socket.emit('chat-msg', chatMsgObject);
  }

  public chatByUserId = (myuserId) => { 
    return Observable.create ((observer) =>{
      this.socket.on (myuserId, (data) => {
        
        observer.next(data);
      })

    })
  }

  public exitSocket = () =>{


    this.socket.disconnect();


  }

  private handleError (err:HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `Sever returned code: ${err.status}, error message is: ${err.message}`
    }
    console.error (errorMessage);
    return Observable.throw (errorMessage)
    
  } // end handleError

} 
