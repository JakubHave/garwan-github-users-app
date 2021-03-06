import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {GithubUser} from '../../model/github-user.model';
import {GithubUsersResult} from '../../model/github-result.model';
import {FormBuilder, Validators} from '@angular/forms';
import {UserSortValues} from '../../model/user-sort.model';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
import {User} from '../../model/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  page = 1;
  perPage = 5;
  userSortValues = Object.keys(UserSortValues);
  totalUsers = 0;
  users: GithubUser[];
  unsubscribe$ = new Subject<void>();
  locationForm = this.formBuilder.group({
    location: ['', Validators.required],
    sortBy: [this.userSortValues[0], Validators.required]
  });

  constructor(private userService: UserService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    if (!this.authService.loggedUserValue) {
      this.authService.getOAuthSessionData()
      // unsubscribe observable on unsubscribe$ emission in ngOnDestroy
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
        sessionData => this.authService.saveUserDataFromOAuth(sessionData as User),
          error => console.log('Backend endpoint /session for OAuh 2.0 is reachable only when app is started by server.js')
      );
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit() {
    this.refreshUsers(this.locationForm.value.location, this.locationForm.value.sortBy, this.perPage, 1);
  }

  private refreshUsers(location: string, sortBy: string, perPage: number, page: number) {
    this.userService.getGithubUsers(location, sortBy, perPage, page)
    // unsubscribe observable on unsubscribe$ emission in ngOnDestroy or after first execution
    // another option is to use async pipe in html
      .pipe(takeUntil(this.unsubscribe$), take(1))
      .subscribe(
      res => {
        this.totalUsers = (res as GithubUsersResult).totalCount;
        this.users = (res as GithubUsersResult).githubUsers;
      }, err => {
        if (err.status === 422) {
          this.toastrService.error('Sorry, only first 1000 users can be viewed, i.e. the max number of valid page is '
            + Math.ceil(1000 / this.perPage), 'Error');
        } else {
          this.userService.handleError(err);
        }
      }
    );
  }

  pageChanged(pageNum: number) {
    this.refreshUsers(this.locationForm.controls['location'].value, this.locationForm.controls['sortBy'].value, this.perPage, pageNum);
  }

  gotoPage(pageNum: number) {
    if (pageNum > Math.ceil(this.totalUsers / this.perPage)) {
      this.toastrService.error('There is no page with number ' + pageNum, 'Error');
      return;
    }
    this.page = pageNum;
    this.pageChanged(pageNum);
  }
}
