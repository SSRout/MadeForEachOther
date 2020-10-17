import { Member } from './../_models/member';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  constructor(private http:HttpClient) { }

  getMembers(){
    //return this.http.get<Member[]>(environment.apiUrl+'users',httpOptions);
    return this.http.get<Member[]>(environment.apiUrl+'users');
  }

  getMemberByName(username:string){
    return this.http.get<Member>(environment.apiUrl+'users/name='+username);
  }

  getMemberById(id:number){
    return this.http.get<Member>(environment.apiUrl+'users/'+id);
  }

}
