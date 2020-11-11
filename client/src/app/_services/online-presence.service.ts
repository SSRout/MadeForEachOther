import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OnlinePresenceService {
  hubUrl=environment.hubUrl;
  private hubConnection:HubConnection;
  private onlineUserSource=new BehaviorSubject<string[]>([]);
  onlineUsers$=this.onlineUserSource.asObservable();
  constructor(private toaster:ToastrService) { }

  crateHubConnection(user:User){
    this.hubConnection=new HubConnectionBuilder().withUrl(this.hubUrl+'presence',{
      accessTokenFactory:()=>user.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection
    .start().
    catch(error=>console.log(error));

    this.hubConnection.on('UserIsOnline',username=>{
      this.toaster.info(username+ ' has Online');
    })

    this.hubConnection.on('UserIsOffline',username=>{
      this.toaster.warning(username+ ' has Offline');
    })

    this.hubConnection.on('GetOnlineUsers',(usernames:string[])=>{
      this.onlineUserSource.next(usernames);
    })
  }

  stopHubConnection(){
    this.hubConnection.stop().catch(error=>console.log(error));
  }

}