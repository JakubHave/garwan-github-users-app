import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../model/user.model';
import {map} from 'rxjs/operators';

const LOGIN_URL = 'https://api.github.com/user';
const USER_DATA = 'USER_DATA';

// OAuth
const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
// this should be kept in environment variable
const CLIENT_ID = '2ca676099c309d54b713';
const SESSION_ENDPOINT = '/session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedUserSub: BehaviorSubject<User>;
  loggedUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.loggedUserSub = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem(USER_DATA)));
    this.loggedUser = this.loggedUserSub.asObservable();
  }

  public get loggedUserValue(): User {
    return this.loggedUserSub.value;
  }

  login(token: string) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });

    return this.http.get(LOGIN_URL, {headers})
      .pipe(map(res => {
          const user = new User(res['login'], token);
          this.saveUserData(user);
          this.loggedUserSub.next(user);
          return res;
        }
      ));
  }

  loginOAuth() {
    window.location.href = `${AUTHORIZE_URL}?scope=user,repo&client_id=${CLIENT_ID}`;
  }

  getOAuthSessionData(): Observable<any> {
   return this.http.get(SESSION_ENDPOINT);
  }

  logout() {
    sessionStorage.clear();
    this.loggedUserSub.next(null);
  }

  saveUserDataFromOAuth(userData: User) {
    this.loggedUserSub.next(userData);
    this.saveUserData(userData);
  }

  private saveUserData(userData: User) {
    sessionStorage.removeItem(USER_DATA);
    sessionStorage.setItem(USER_DATA, JSON.stringify(userData));
  }
}
