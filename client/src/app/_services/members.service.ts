import { UserParams } from './../_models/userParams';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Member } from './../_models/member';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AccountService } from './account.service';
import { User } from '../_models/user';

// const httpOptions={
//   headers:new HttpHeaders({
//     Authorization:'Bearer '+JSON.parse(localStorage.getItem('user'))?.token
//   })
// }

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: Member[] = [];
  memberCache=new Map();
  user:User;
  userParams:UserParams;

  constructor(private http: HttpClient,private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=>{
      this.user=user;
      this.userParams=new UserParams(user);
    });
  }

  getUserParams(){
    return this.userParams
  }

  setUserParams(params:UserParams){
    this.userParams=params;
  }

  resetUserParams(){
    this.userParams=new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    var response=this.memberCache.get(Object.values(userParams).join('-'));
    if(response){
      return of(response);
    }

    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(
      environment.apiUrl + 'users',
      params,this.http
    ).pipe(map(response=>{
      this.memberCache.set(Object.values(userParams).join('-'),response);
      return response;
    }));
  }

  getMemberByName(username: string) {
    const member = [...this.memberCache.values()]
    .reduce((arr,elem)=>arr.concat(elem.result),[])
    .find((member:Member)=>member.username===username);
    if (member != undefined) return of(member);
    return this.http.get<Member>(environment.apiUrl + 'users/name=' + username);
  }

  getMemberById(id: number) {
    return this.http.get<Member>(environment.apiUrl + 'users/' + id);
  }

  updateMember(member: Member) {
    return this.http.put(environment.apiUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(
      environment.apiUrl + 'users/set-main-photo/' + photoId,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(
      environment.apiUrl + 'users/delete-photo/' + photoId
    );
  }

  // private getPaginationHeaders(pageNumber: number, pageSize: number) {
  //   let params = new HttpParams();
  //   params = params.append('pageNumber', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   return params;
  // }

  // private getPaginatedResult<T>(url, params) {
  //   const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  //   return this.http
  //     .get<T>(url, { observe: 'response', params })
  //     .pipe(
  //       map((response) => {
  //         paginatedResult.result = response.body;
  //         if (response.headers.get('Pagination') != null) {
  //           paginatedResult.pagination = JSON.parse(
  //             response.headers.get('Pagination')
  //           );
  //         }
  //         return paginatedResult;
  //       })
  //     );
  // }

  addLike(username:string){
    return this.http.post(environment.apiUrl+'likes/'+username,{});
  }

  getLikes(predicate:string,pageNumber,pageSize){
    let params =getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    console.log(params);
    return getPaginatedResult<Partial<Member[]>>(environment.apiUrl+'likes',params,this.http);
  }

  

}
