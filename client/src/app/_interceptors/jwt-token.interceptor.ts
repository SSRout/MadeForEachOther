import { AccountService } from './../_services/account.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  constructor(private accountService:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUSer:User;
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=>currentUSer=user);
    if(currentUSer){
      request=request.clone({
        setHeaders:{
          Authorization:`Bearer ${currentUSer.token}`
        }
      })
    }
    return next.handle(request);
  }
}
