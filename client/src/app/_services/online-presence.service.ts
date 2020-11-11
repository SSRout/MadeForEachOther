import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
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

  constructor(private toaster:ToastrService,private router:Router) { }

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
      this.onlineUsers$.pipe(take(1)).subscribe(usernames=>{
        this.onlineUserSource.next([...usernames,username]);
      });
    })

    this.hubConnection.on('UserIsOffline',username=>{
      this.onlineUsers$.pipe(take(1)).subscribe(usernames=>{
        this.onlineUserSource.next([...usernames.filter(x=>x!==username)]);
      })
    })

    this.hubConnection.on('GetOnlineUsers',(usernames:string[])=>{
      this.onlineUserSource.next(usernames);
    })

    this.hubConnection.on('NewMessageReceived',({username,alias})=>{
      this.toaster.info(alias+' has sent You a new Message!')
      .onTap.pipe(take(1)).subscribe(()=>this.router.navigateByUrl('/members/'+username+'?tab=3')); 

    })
  }

  stopHubConnection(){
    this.hubConnection.stop().catch(error=>console.log(error));
  }

}
