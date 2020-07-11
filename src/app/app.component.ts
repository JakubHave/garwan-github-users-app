import { Component } from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {User} from './model/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'git-hub-users';
  loggedUser: User;

  constructor(private router: Router,
              private authService: AuthService) {
    this.authService.loggedUser.subscribe(user => this.loggedUser = user);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
