import { OnlinePresenceService } from './_services/online-presence.service';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Made For Each Other';

  constructor(private accountService:AccountService,private onlinePresenceService:OnlinePresenceService){}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user:User=JSON.parse(localStorage.getItem('user'));
    if(user){
      this.accountService.setCurrentUser(user);
      this.onlinePresenceService.crateHubConnection(user);
    }
    
  }
}
