import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Made For Each Other';
  users:any;
  constructor(private http:HttpClient,private accountService:AccountService){}

  ngOnInit(): void {
    this.getUsers()
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user:User=JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }

  getUsers(){
    this.http.get('https://localhost:5001/weatherforecast').subscribe(result=>{
      this.users=result;
    },error=>{
        console.log(error);
    })
  }
}
