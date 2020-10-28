import { Router } from '@angular/router';
import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  @Output() cancelRegister=new EventEmitter();
  registerForm:FormGroup;
  maxDate:Date;
  validationErrors:string[]=[];
  constructor(private accountService:AccountService,private toastr:ToastrService,private fb:FormBuilder,private route:Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate=new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-21);
  }

  // initializeForm(){//reactive form without form Builder
  //   this.registerForm=new FormGroup({
  //     username:new FormControl('',Validators.required),
  //     password:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
  //     confirmPassword:new FormControl('',[Validators.required,this.matchValues('password')])
  //   })
  // }

  initializeForm(){//reactive form with form Builder
    this.registerForm=this.fb.group({
      gender:['',Validators.required],
      dob:['',Validators.required],
      username:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',[Validators.required,this.matchValues('password')]]
    })
  }

  matchValues(match:string):ValidatorFn{//custom validator
    return(control:AbstractControl)=>{
      return control?.value===control?.parent?.controls[match].value?null:{isMatch:true}
    }
  }

  register(){
    const formValues=this.registerForm.value;
    var user={
      gender:formValues.gender,
      DateOFBirth:new Date(formValues.dob),
      userName:formValues.username,
      password:formValues.password
    }
   this.accountService.register(user).subscribe(response=>{
     this.route.navigateByUrl('/members');
   },error=>{
     console.log(error);
    this.validationErrors=error;
   });
  }

  cancel(){
    console.log('canceled');
    this.cancelRegister.emit(false);
  }

}
