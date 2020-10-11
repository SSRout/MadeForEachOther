import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  @Output() cancelRegister=new EventEmitter();
  model:any={};
  constructor(private accountService:AccountService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  register(){
   this.accountService.register(this.model).subscribe(response=>{
     this.cancel();
   },error=>{
     console.log(error);
     this.toastr.error(error.error);
   });
  }

  cancel(){
    console.log('canceled');
    this.cancelRegister.emit(false);
  }

}