import { ToastrService } from 'ngx-toastr';
import { Photo } from './../../_models/photo';
import { MembersService } from './../../_services/members.service';
import { take } from 'rxjs/operators';
import { AccountService } from './../../_services/account.service';
import { environment } from './../../../environments/environment.prod';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member:Member;
  uploader:FileUploader;
  hasBaseDropZoneOver=false;
  user:User;

  constructor(private accountService:AccountService,private memberService:MembersService,private toasterService:ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(res=>this.user=res)
   }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e:any){
    this.hasBaseDropZoneOver=e;
  }

  initializeUploader(){
    this.uploader=new FileUploader({
      url:environment.apiUrl+'users/add-photo',
      authToken:'Bearer '+this.user.token,
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10*1024*1024  
    });

    this.uploader.onAfterAddingAll=(file)=>{
      file.WithCredentials=false;
    }

    this.uploader.onSuccessItem=(item,response,status,header)=>{
      if(response){
        const photo=JSON.parse(response);
        this.member.photos.push(photo);
      }
    }
  }

  setMainPhoto(photo:Photo){
      this.memberService.setMainPhoto(photo.id).subscribe(()=>{
        this.user.photoUrl=photo.url;
        this.accountService.setCurrentUser(this.user);
        this.member.photoUrl=photo.url;
        this.member.photos.forEach(p=>{
          if(p.isMain) p.isMain=false;
          if(p.id===photo.id) p.isMain=true;
        })
      });
  }

  deletePhoto(photoId:number){
    this.memberService.deletePhoto(photoId).subscribe(()=>{
      this.member.photos=this.member.photos.filter(x=>x.id!==photoId);
      this.toasterService.success('Photo Deleted Succes');
    });
  }

}
