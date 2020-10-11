import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  model:any={};
  constructor(public accountService:AccountService,private router:Router,private toastr:ToastrService) { }
  ngOnInit(): void {
  }

  login(){
    this.accountService.login(this.model).subscribe(response=>{
      this.router.navigateByUrl('/members')
      this.toastr.success('Loged in success')
    },error=>{
      console.log(error);
      this.toastr.error(error.error);
    });
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  //without async |
  // getCurrentUser(){
  //   this.accountService.currentUser$.subscribe(user=>{
  //     this.isLogedin=!!user;//true or false
  //   },error=>{
  //     console.log(error)
  //   });
  // }

}
