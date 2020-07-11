import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../model/user.model';
import {map} from 'rxjs/operators';

const LOGIN_URL = 'https://api.github.com/user';
const USER_DATA = 'USER_DATA';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedUserSub: BehaviorSubject<User>;
  public loggedUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.loggedUserSub = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(USER_DATA)));
    this.loggedUser = this.loggedUserSub.asObservable();
  }

  public get loggedUserValue(): User {
    return this.loggedUserSub.value;
  }

  login(token: string) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });

  //  headers =  headers.append('Authorization', 'Bearer dfc984ff3f09a31130b1da35c7765ae055692d43');

    return this.http.get(LOGIN_URL, {headers})
      .pipe(map(res => {
          const user = new User(res['login'], token);
          this.saveUserData(user);
          this.loggedUserSub.next(user);
          return res;
        }
      ));
  }

  logout() {
    localStorage.clear();
    this.loggedUserSub.next(null);
  }

  private saveUserData(userData: User) {
    localStorage.removeItem(USER_DATA);
    localStorage.setItem(USER_DATA, JSON.stringify(userData));
  }
}
