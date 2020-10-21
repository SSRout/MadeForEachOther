import { Member } from './../_models/member';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

//use interceptor to pass token
// const httpOptions={
//   headers:new HttpHeaders({
//     Authorization:'Bearer '+JSON.parse(localStorage.getItem('user'))?.token
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  members:Member[]=[];
  constructor(private http:HttpClient) { }

  getMembers(){
    if(this.members.length>0) return of(this.members);
    //return this.http.get<Member[]>(environment.apiUrl+'users',httpOptions);
    return this.http.get<Member[]>(environment.apiUrl+'users').pipe(
      map(members=>{
        this.members=members;
        return members;
    }));
  }

  getMemberByName(username:string){
    const member=this.members.find(x=>x.username===username);
    if(member!=undefined) return of(member);
    return this.http.get<Member>(environment.apiUrl+'users/name='+username);
  }

  getMemberById(id:number){
    return this.http.get<Member>(environment.apiUrl+'users/'+id);
  }

  updateMember(member:Member){
    return this.http.put(environment.apiUrl+'users',member).pipe(
      map(()=>{
        const index=this.members.indexOf(member);
        this.members[index]=member;
      })
    )
  }

  setMainPhoto(photoId:number){
    return this.http.put(environment.apiUrl+'users/set-main-photo/'+photoId,{});
  }

  deletePhoto(photoId:number){
    return this.http.delete(environment.apiUrl+'users/delete-photo/'+photoId);
  }

}
