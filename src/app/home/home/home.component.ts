import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {GithubUser} from '../../model/github-user.model';
import {GithubUsersResult} from '../../model/githubUsers-result.model';
import {FormBuilder, Validators} from '@angular/forms';
import {UserSortValues} from '../../model/user-sort.model';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';

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
  userSubscription: Subscription;
  locationForm = this.formBuilder.group({
    location: ['', Validators.required],
    sortBy: [this.userSortValues[0], Validators.required]
  });

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

  onSubmit() {
    this.refreshUsers(this.locationForm.value.location, this.locationForm.value.sortBy, this.perPage, 1);
  }

  private refreshUsers(location: string, sortBy: string, perPage: number, page: number) {
    this.userSubscription = this.userService.getGithubUsers(location, sortBy, perPage, page).subscribe(
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
}
