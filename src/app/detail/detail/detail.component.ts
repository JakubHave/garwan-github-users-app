import {Component, OnDestroy, OnInit} from '@angular/core';
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
  allRepos: Repository[];
  repos: Repository[];
  allFollowers: GithubUser[];
  followers: GithubUser[];
  activeNav = 'top';
  userSubscription: Subscription;
  reposSubscription: Subscription;
  followerSubscription: Subscription;
  routeSubscription: Subscription;
  perPage = 5;
  pageRepo = 1;
  pageFollow = 1;

  constructor(private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe( (params: Params) => {
      const userName = params['name'];
      this.pageRepo = 1;
      this.pageFollow = 1;
      this.getUser(userName);
      this.getAllUserRepos(userName);
      this.getAllUserFollowers(userName);
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
    if (this.reposSubscription) { this.reposSubscription.unsubscribe(); }
    if (this.followerSubscription) { this.followerSubscription.unsubscribe(); }
    if ( this.routeSubscription ) { this.routeSubscription.unsubscribe(); }
  }

  private getUser(userName: string): void {
    this.userSubscription = this.userService.getGithubUser(userName).subscribe(
      user => this.user = user,
      err => this.userService.handleError(err)
    );
  }

  private getAllUserRepos(userName: string) {
    this.reposSubscription = this.userService.getAllUserRepos(userName).subscribe(
      repos => {
        this.allRepos = repos;
        this.repos = this.allRepos.slice(0, this.perPage);
      },
      err =>  this.userService.handleError(err)
    );
  }

  private getAllUserFollowers(userName: string) {
    this.followerSubscription = this.userService.getAllUserFollowers(userName).subscribe(
      followers => {
        this.allFollowers = followers;
        this.followers = this.allFollowers.slice(0, this.perPage);
      },
      err =>  this.userService.handleError(err)
    );
  }

  pageRepoChanged(pageNum: number) {
    this.repos = this.allRepos.slice((pageNum - 1) * this.perPage, pageNum * this.perPage);
  }

  pageFollowChanged(pageNum: number) {
    this.followers = this.allFollowers.slice((pageNum - 1) * this.perPage, pageNum * this.perPage);
  }
}
