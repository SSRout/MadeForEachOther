import { Message } from './../_models/message';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http:HttpClient) { }

  getMessages(pageNumber, pageSize, container) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(environment.apiUrl +'messages', params, this.http);
  }

 
  getMessageThread(username:string){
    return this.http.get<Message[]>(environment.apiUrl+'messages/thread/'+username);
  }

  sendMessage(username:string,content:string){
    return this.http.post<Message>(environment.apiUrl+'messages',{recipientUsername:username,content})
  }
 
  deleteMessage(id:number){
    return this.http.delete(environment.apiUrl+'messages/'+id);
  } 

}
