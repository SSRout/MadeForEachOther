import { User } from './../_models/user';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  getUsersWithRoles(){
    return this.http.get<Partial<User[]>>(environment.apiUrl+'admin/users-with-roles')
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(environment.apiUrl+'admin/edit-roles/' + username + '?roles=' + roles, {});
  }

  getPhotosForApproval() {
    return this.http.get<Photo[]>(environment.apiUrl + 'admin/photos-to-moderate');
    }
    approvePhoto(photoId: number) {
    return this.http.post(environment.apiUrl + 'admin/approve-photo/' + photoId, {});
    }
    rejectPhoto(photoId: number) {
    return this.http.post(environment.apiUrl + 'admin/reject-photo/' + photoId, {});
    }

}
