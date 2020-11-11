import { OnlinePresenceService } from './../../_services/online-presence.service';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from './../../_services/members.service';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member:Member;

  constructor(private memberService:MembersService,private toaster:ToastrService,public presenceService:OnlinePresenceService) { }

  ngOnInit(): void {
  }

  addLike(member:Member){
    this.memberService.addLike(member.username).subscribe(()=>{
      this.toaster.success('you have liked'+member.alias);
    })
  }

}
