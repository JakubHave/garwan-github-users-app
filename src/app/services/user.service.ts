import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {GithubUsersResult} from '../model/github-result.model';
import {forkJoin, Observable, of} from 'rxjs';
import {GithubUser} from '../model/github-user.model';
import {ToastrService} from 'ngx-toastr';
import {Repository} from '../model/repository.model';
import {Issue} from '../model/issue.model';
import * as parse from 'parse-link-header';
import {IssueResult} from '../model/issue-result.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private gitHubApi = 'https://api.github.com';
  private usersSearchQuery = '/search/users?q=location:[location]&sort=[sort]&per_page=[per_page]&page=[page]';
  private userFollowersQuery = '/users/[userName]/followers?per_page=[per_page]&page=[page]';
  private userReposQuery = '/users/[userName]/repos?per_page=[per_page]&page=[page]';
  private personalReposQuery = '/user/repos?per_page=[per_page]&page=[page]';
  private issueQuery = '/issues?filter=all&state=all&per_page=[per_page]&page=[page]';
  private userQuery = '/users/[userName]';

  constructor(private http: HttpClient,
              private toastrService: ToastrService) { }

  getGithubUser(userName: string): Observable<GithubUser> {
    const searchQuery = this.userQuery.replace('[userName]', userName);
    return this.http.get<GithubUser>(this.gitHubApi + searchQuery);
  }

  getGithubUsers(location: string, sort: string, perPage: number, page: number): Observable<any> {
    const searchQuery = this.usersSearchQuery.replace('[location]', location)
      .replace('[sort]', sort)
      .replace('[per_page]', '' + perPage)
      .replace('[page]', '' + page);

    return this.http.get(this.gitHubApi + searchQuery).pipe(
      switchMap(res => {
          const result = new GithubUsersResult();
          result.totalCount = res['total_count'];
          result.githubUsers = [];
          const usersPage = res['items'];
          const users = [];

          usersPage.forEach(user => {
            result.githubUsers.push(new GithubUser(user['login'], user['avatar_url'], 0, 0));
            users.push(this.getGithubUser(user['login']));
          });
          return forkJoin(of(result), ...users);
        }
      ),
      switchMap(res => {
        const resArray = res as any[];
        if (resArray.length === 1) {
          return res;
        }
        const result = resArray.shift() as GithubUsersResult;
        result.githubUsers.forEach((user, index) => {
          user.followers = (resArray[index] as GithubUser).followers;
          user.public_repos = (resArray[index] as GithubUser).public_repos;
        });

        return of<GithubUsersResult>(result);
      })
    );
  }

  /*
  *   This retrieves public repositories for arbitrary user
  */
  getUserRepos(userName: string, perPage: number, page: number): Observable<Repository[]> {
    const searchQuery = this.userReposQuery.replace('[userName]', userName)
      .replace('[per_page]', '' + perPage)
      .replace('[page]', '' + page);

    return this.http.get<Repository[]>(this.gitHubApi + searchQuery);
  }

  /*
  *   This retrieves private and public repositories for authenticated user
  */
  getPersonalRepos(perPage: number, page: number): Observable<Repository[]> {
    const searchQuery = this.personalReposQuery.replace('[per_page]', '' + perPage)
      .replace('[page]', '' + page);

    return this.http.get<Repository[]>(this.gitHubApi + searchQuery);
  }

  getUserFollowers(userName: string, perPage: number, page: number): Observable<GithubUser[]> {
    const searchQuery = this.userFollowersQuery.replace('[userName]', userName)
      .replace('[per_page]', '' + perPage)
      .replace('[page]', '' + page);

    return this.http.get<GithubUser[]>(this.gitHubApi + searchQuery);
  }

  /*
  *   This retrieves issues and last page number of issues pagination for authenticated user
  */
  getIssues(perPage: number, page: number): Observable<IssueResult> {
    const searchQuery = this.issueQuery.replace('[per_page]', '' + perPage)
      .replace('[page]', '' + page);

    return this.http.get<Issue[]>(this.gitHubApi + searchQuery, { observe: 'response' }).pipe(
      switchMap(res => {
        const headersLink = res.headers.get('Link');
        const issueResult = new IssueResult();
        issueResult.lastPageNum = parse(headersLink)['last']['page'];
        issueResult.issues = res.body;
        return of(issueResult);
      })
    );
  }

  handleError(err: any) {
    if (err.status === 403) {
      this.toastrService.error('Sorry, rate limit on server exceeded. Please wait 60 seconds and try again.', 'Error');
    } else {
      this.toastrService.error(err.message, 'Error');
    }
  }


}
