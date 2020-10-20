import { ToastrService } from 'ngx-toastr';
import { City } from './../../_models/city';
import { State } from './../../_models/state';
import { Country } from './../../_models/country';
import { MasterService } from './../../_services/master.service';
import { MembersService } from './../../_services/members.service';
import { AccountService } from './../../_services/account.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm:NgForm; 
  member: Member;
  user: User;
  @HostListener('window:beforeunload',['$event']) unloadNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue=true;
    }
  }
  countrries: Country[];
  selectedCountry=null;

  states: State[];
  selectedState = null;

  cities: City[];

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private masterService: MasterService,
    private toaster:ToastrService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.loadMember();
    this.countrries = this.masterService.getCountries();
  }


  onSelectCountry(id: string) {
    this.selectedCountry = id;
    this.selectedState = 0;
    this.cities = null;
    this.states = this.masterService.getStates().filter((item) => {
      return item.country_id ==id;
    });
  }

  onSelectState(id: string) {
    this.selectedState = id;
    this.cities = this.masterService
      .getCity()
      .filter((item) => item.state_id ==id);
  }

  loadMember() {
    this.memberService
      .getMemberByName(this.user.userName)
      .subscribe((member) => (this.member = member));
  }

  updateMember(){
    console.log(this.member);
    this.memberService.updateMember(this.member).subscribe(()=>{
      this.toaster.success("Updated Success")
      this.editForm.reset(this.member);
    })   
  }

}
