import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {GithubUser} from '../../model/github-user.model';
import {Repository} from '../../model/repository.model';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  user: GithubUser;
  reposSize: number;
  repos: Repository[];
  followersSize: number;
  followers: GithubUser[];
  activeNav = 'top';
  unsubscribe$ = new Subject<void>();
  perPage = 5;
  pageRepo = 1;
  pageFollow = 1;
  userName: string;

  @Input()
  personalUserName: string;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.route.params
    // unsubscribe observable on unsubscribe$ emission in ngOnDestroy
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
      (params: Params) => {
        this.userName = params['name'];
        if (this.personalUserName) {
          this.userName = this.personalUserName;
        }
        this.pageRepo = 1;
        this.pageFollow = 1;
        this.getUser(this.userName);
        this.getRepoPage(1);
        this.getUserFollowers(this.userName, this.perPage, 1);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getUser(userName: string): void {
    this.userService.getGithubUser(userName)
    // unsubscribe observable on unsubscribe$ emission in ngOnDestroy or after first execution
    // another option is to use async pipe in html
      .pipe(takeUntil(this.unsubscribe$), take(1))
      .subscribe(
      user => {
        this.user = user;
        this.reposSize = user.public_repos + (user.total_private_repos ? user.total_private_repos : 0);
        this.followersSize = user.followers;
      },
      err => this.userService.handleError(err)
    );
  }

  /*
  *   This retrieves public repositories for arbitrary user
  */
  private getUserRepos(userName: string, perPage: number, page: number) {
    this.userService.getUserRepos(userName, perPage, page)
    // unsubscribe observable on unsubscribe$ emission in ngOnDestroy or after first execution
      .pipe(takeUntil(this.unsubscribe$), take(1))
      .subscribe(
      repos => this.repos = repos,
      err =>  this.userService.handleError(err)
    );
  }

  /*
  *   This retrieves private and public repositories for authenticated user
  */
  private getPersonalRepos(userName: string, perPage: number, page: number) {
    this.userService.getPersonalRepos(perPage, page)
    // unsubscribe observable on unsubscribe$ emission in ngOnDestroy or after first execution
      .pipe(takeUntil(this.unsubscribe$), take(1))
      .subscribe(
      repos => this.repos = repos,
      err =>  this.userService.handleError(err)
    );
  }

  private getRepoPage(pageNum: number) {
    if (this.personalUserName) {
      this.getPersonalRepos(this.userName, this.perPage, pageNum);
    } else {
      this.getUserRepos(this.userName, this.perPage, pageNum);
    }
  }

  private getUserFollowers(userName: string, perPage: number, page: number) {
    this.userService.getUserFollowers(userName, perPage, page)
    // unsubscribe observable on unsubscribe$ emission in ngOnDestroy or after first execution
      .pipe(takeUntil(this.unsubscribe$), take(1))
      .subscribe(
      followers => this.followers = followers,
      err =>  this.userService.handleError(err)
    );
  }

  pageRepoChanged(pageNum: number) {
    this.getRepoPage(pageNum);
  }

  pageFollowChanged(pageNum: number) {
    this.getUserFollowers(this.userName, this.perPage, pageNum);
  }

  gotoPageRepo(pageNum: number) {
    if (pageNum > Math.ceil(this.reposSize / this.perPage)) {
      this.toastrService.error('There is no page with number ' + pageNum, 'Error');
      return;
    }
    this.pageRepo = pageNum;
    this.pageRepoChanged(pageNum);
  }

  gotoPageFollow(pageNum: number) {
    if (pageNum > Math.ceil(this.followersSize / this.perPage)) {
      this.toastrService.error('There is no page with number ' + pageNum, 'Error');
      return;
    }
    this.pageFollow = pageNum;
    this.pageFollowChanged(pageNum);
  }
}
