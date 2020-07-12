import {Component, OnDestroy} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {User} from './model/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'git-hub-users';
  loggedUser: User;
  authSubscription: Subscription;

  constructor(private router: Router,
              private authService: AuthService) {
    this.authSubscription = this.authService.loggedUser.subscribe(
      user => this.loggedUser = user
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if ( this.authSubscription ) { this.authSubscription.unsubscribe(); }
  }
}
