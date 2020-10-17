import { MembersService } from './../../_services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  member:Member;
  constructor(private memberService:MembersService,private router:ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    if (Number(this.router.snapshot.paramMap.get('username'))){
      this.memberService.getMemberById(parseInt(this.router.snapshot.paramMap.get('username'))).subscribe(member=>{
        this.member=member;
      })
    }
    else{
      this.memberService.getMemberByName(this.router.snapshot.paramMap.get('username')).subscribe(member=>{
        this.member=member;
      })
    }
    
  }

}
