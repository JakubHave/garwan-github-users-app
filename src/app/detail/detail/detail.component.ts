import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {GithubUser} from '../../model/github-user.model';
import {Repository} from '../../model/repository.model';
import {Subscription} from 'rxjs';

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
  userSubscription: Subscription;
  reposSubscription: Subscription;
  persReposSubscription: Subscription;
  followerSubscription: Subscription;
  routeSubscription: Subscription;
  perPage = 5;
  pageRepo = 1;
  pageFollow = 1;
  userName: string;

  @Input()
  personalUserName: string;

  constructor(private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe( (params: Params) => {
      this.userName = params['name'];
      if (this.personalUserName) {
        this.userName = this.personalUserName;
      }
      this.pageRepo = 1;
      this.pageFollow = 1;
      this.getUser(this.userName);
      this.getRepoPage(1);
      this.getUserFollowers(this.userName, this.perPage, 1);
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
    if (this.reposSubscription) { this.reposSubscription.unsubscribe(); }
    if (this.persReposSubscription) { this.persReposSubscription.unsubscribe(); }
    if (this.followerSubscription) { this.followerSubscription.unsubscribe(); }
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

  private getUser(userName: string): void {
    this.userSubscription = this.userService.getGithubUser(userName).subscribe(
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
    this.reposSubscription = this.userService.getUserRepos(userName, perPage, page).subscribe(
      repos => this.repos = repos,
      err =>  this.userService.handleError(err)
    );
  }

  /*
  *   This retrieves private and public repositories for authenticated user
  */
  private getPersonalRepos(userName: string, perPage: number, page: number) {
    this.persReposSubscription = this.userService.getPersonalRepos(perPage, page).subscribe(
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
    this.followerSubscription = this.userService.getUserFollowers(userName, perPage, page).subscribe(
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
}
