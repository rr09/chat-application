import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from './../../socket.service';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {ChatMessage} from './chat';
import {CheckUser} from './CheckUser'






@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})
export class ChatBoxComponent implements OnInit //,CheckUser
 {

@ViewChild ('scrollMe' , {read: ElementRef})

public scrollMe: ElementRef;

  public authToken: any;
  public userInfo: any;

  public userList: any = [];
  public disconnectedSocket: boolean;

  public scrollToChatTop: boolean = false;

  public receiverId: any;
  public receiverName: any;
  public messageText: any;
  public messageList: any = [];
  public previousChatList: any = [];
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;



  //Constructor is used for dependency injection
  constructor(
    public appService: AppService,
    public socketService: SocketService,
    public router: Router,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {
    this.receiverId = cookieService.get('receiverId');
    this.receiverName = cookieService.get('receiverName');
  }

  ngOnInit() {
    this.authToken = this.cookieService.get('authtoken');

    this.userInfo = this.appService.getUserInfoFromLocalstorage();

    this.receiverId = this.cookieService.get ("receiverId");

    this.receiverName =this.cookieService.get("receiverName");
    console.log (this.receiverId, this.receiverName);

    // if (this.receiverId!==null && this.receiverId!=undefined && this.receiverId!= '') {
    //   this.userSelectedToChat (this.receiverId, this.receiverName)
    // }

    //console.log(this.userInfo);
    //this.checkStatus();
    this.verifyUserConfirmation(); 
    this.getOnlineUserList();
    this.getMessageFromUser();
    this.getUnseenChatUserList();

  }

  //   public checkStatus: any = () => {

  //   if (this.authToken === undefined || this.authToken === '' || this.authToken === null) {
  //     this.router.navigate(['/']);
  //     return false;

  //   } else {
  //     return true;
  //   }
  // }  

  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser().subscribe((data) => {
      
      this.disconnectedSocket = false;
      this.socketService.setUser(this.authToken);
      this.getOnlineUserList();
    });
  }

  public getOnlineUserList: any = () => {

    this.socketService.onlineUserList().subscribe((userList) => {

      this.userList = [];


      for (let x in userList) {

        let temp = { 'userId': x, 'name':userList[x],'unread': 0, 'chatting': false };
        console.log(temp);

        this.userList.push(temp);
        console.log(userList);
      }
      
      
      



    }); // end online-user-list

  }

  public getUnseenChatUserList:any = () =>{

    let data = this.userInfo.userId;

    this.appService.unseenChatUserList(data)
    .subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        console.log("Unseen chat list called")

      }

      else{
        this.toastr.error (apiResponse.message)
      }
    },
      (err) => {
        this.toastr.error('some error occured')
      });
  } 

  public getPreviousChatWithAUser: any = ()=> {
    let previousData = (this.messageList.length >0?this.messageList.slice():[])
    this.socketService.getChat(this.userInfo.userId,this.receiverId, this.pageValue * 10)
    .subscribe((apiResponse) => {
      console.log(apiResponse);

      if (apiResponse.status == 200) {
        this.messageList = apiResponse.data.concat(previousData);
      }else {

        this.messageList = previousData;
        this.toastr.warning('No message available')
      }

    })
  }

  public loadEarlierPageOfChat: any = () => {

    this.loadingPreviousChat = true;

    this.pageValue++;
    this.scrollToChatTop = true;

    this.getPreviousChatWithAUser() ; 

  } 

  public userSelectedToChat: any = (id, name) =>{
    console.log("setting user as active")

    this.userList.map ((user) => {
      if(user.userId==id) {
        user.chatting=true;
      }
      else{
        user.chatting=false;
      }
    })

    this.cookieService.set('receiverId', id);
    this.cookieService.set('receiverName', name);

    this.receiverName = name;
    this.receiverId = id;
    this.messageList = []; // initialise the list of messages when we switch users
    this.pageValue = 0;

    let chatDetails = {
      userId: this.userInfo.userId,
      senderid:id
    }

    this.socketService.markChatAsSeen (chatDetails);
    this.getPreviousChatWithAUser() ;
    


  }

  public sendMessageUsingKeypress: any = (event:any) => {
    if (event.keyCode === 13) // 13 is the keycode of enter
    {
      this.sendMessage();
    }
  }

  public sendMessage: any = () => {
    if (this.messageText) {
      let chatMsgObject:ChatMessage = {
        senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: this.cookieService.get('receiverName'),
        receiverId: this.cookieService.get('receiverId'),
        message: this.messageText,
        createdOn: new Date()

      }
      console.log(chatMsgObject);
      this.socketService.SendChatMessage(chatMsgObject);
      this.pushToChatWindow(chatMsgObject)
    }
    else {
      this.toastr.warning('text message can not be empty');
    }

  }

  public pushToChatWindow: any = (data) => {
    
    this.messageList.push(data);
    this.messageText = "";
    this.scrollToChatTop  = false;

  } 

  public getMessageFromUser: any = () => { 
    this.socketService.chatByUserId (this.userInfo.userId).subscribe ((data) => { 
      
      (this.receiverId == data.senderId)?this.messageList.push (data):'';
      this.toastr.success (`${data.senderName} says : ${data.message}`);
      this.scrollToChatTop=false;
      

    });
    
  }

  public logout:any = () => {

    this.appService.logout().subscribe ((apiResponse) => {

      if (apiResponse.status === 200) {
        console.log("logout called")
        this.cookieService.delete('authtoken');
        this.cookieService.delete('receiverId');
        this.cookieService.delete('receiverName');
        this.socketService.exitSocket()
        this.router.navigate (['/']);
      }
      else {
        this.toastr.error (apiResponse.message)
      }

    }, (err) => {
      this.toastr.error('some error occured')
    }

    ); 
    
  }

  // handle the output from a child component 

  public showUserName =(name:string)=>{

    this.toastr.success("You are chatting with "+name)

  }

}
