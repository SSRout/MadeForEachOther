import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  @Output() cancelRegister=new EventEmitter();
  model:any={};
  registerForm:FormGroup;
  constructor(private accountService:AccountService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){//reactive form
    this.registerForm=new FormGroup({
      username:new FormControl('',Validators.required),
      password:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
      confirmPassword:new FormControl('',[Validators.required,this.matchValues('password')])
    })
  }

  matchValues(match:string):ValidatorFn{//custom validator
    return(control:AbstractControl)=>{
      return control?.value===control?.parent?.controls[match].value?null:{isMatch:true}
    }
  }

  register(){
    console.log(this.registerForm.value);
  //  this.accountService.register(this.model).subscribe(response=>{
  //    this.cancel();
  //  },error=>{
  //    console.log(error);
  //    this.toastr.error(error.error);
  //  });
  }

  cancel(){
    console.log('canceled');
    this.cancelRegister.emit(false);
  }

}
