import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserCredentials} from '../model/user-credentials.model';

const LOGIN_URL = 'https://api.github.com/user';
const USER_CREDENTIALS = 'USER_CREDENTIALS';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(formGroup, successCallBack, errorCallBack) {

    const userCredentials = new UserCredentials(formGroup.value.username, formGroup.value.password);
    let headers = new HttpHeaders();
    headers =  headers.append('Authorization', 'Basic ' + btoa(userCredentials.name + ':' + userCredentials.password));

    this.http.get(LOGIN_URL, {headers}
    ).subscribe(
      res => {
        this.saveCredentials(userCredentials);
        return successCallBack && successCallBack();
      }, err => {
        return errorCallBack && errorCallBack();
      }
    ) ;
  }

  logout() {
    window.sessionStorage.clear();
  }

  saveCredentials(userCredentials: UserCredentials) {
    window.sessionStorage.removeItem(USER_CREDENTIALS);
    window.sessionStorage.setItem(USER_CREDENTIALS, JSON.stringify(userCredentials));
  }

  getCredentials(): UserCredentials {
    return JSON.parse(sessionStorage.getItem(USER_CREDENTIALS));
  }
}
