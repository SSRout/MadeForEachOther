import { User } from './../_models/user';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OnlinePresenceService } from './online-presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private currentUserSource=new ReplaySubject<User>(1);
  currentUser$=this.currentUserSource.asObservable();
  constructor(private http: HttpClient,private onlinePresenceService:OnlinePresenceService) {}

  login(model: any) {
    return this.http.post(environment.apiUrl + 'account/login', model).pipe(
      map((response:User)=>{
        const user = response;
        if(user){
          this.setCurrentUser(user);
          this.onlinePresenceService.crateHubConnection(user)
        }
      })
    );
  }

  register(model:any){
    return this.http.post(environment.apiUrl+'account/register',model).pipe(
      map((user:User)=>{
        if(user){        
          this.setCurrentUser(user);
          this.onlinePresenceService.crateHubConnection(user)
        }
      })
    )
  }

  setCurrentUser(user:User){
    user.roles=[];
    const roles=this.getDecodedToken(user.token).role;
    Array.isArray(roles)?user.roles=roles:user.roles.push(roles); 
    localStorage.setItem('user',JSON.stringify(user))
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.onlinePresenceService.stopHubConnection()
  }

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }

}
