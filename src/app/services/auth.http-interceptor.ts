import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import {AuthService} from './auth.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.authService.loggedUserValue && this.authService.loggedUserValue.access_token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.loggedUserValue.access_token}`
        }
      });
    }

    return next.handle(req);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
];
