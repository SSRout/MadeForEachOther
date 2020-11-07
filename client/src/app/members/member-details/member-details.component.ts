import { MessageService } from './../../_services/message.service';
import { Message } from './../../_models/message';
import { MembersService } from './../../_services/members.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  @ViewChild('memberTabs')  memberTabs: TabsetComponent;
  member:Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab:TabDirective;
  messages:Message[]=[];

  constructor(private memberService:MembersService,private router:ActivatedRoute,private  messageService:MessageService) { }

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
   // this.galleryImages = this.getImages(); 
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
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
        this.galleryImages = this.getImages(); 
      })
    }    
  }

  loadMessages(){
    this.messageService.getMessageThread(this.member.username).subscribe(message=>{
      this.messages=message;
    });
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }


  onTabActivated(data:TabDirective){
    this.activeTab=data;
    if(this.activeTab.heading==='Messages' && this.messages.length===0){
      this.loadMessages();
    }
  }

}
