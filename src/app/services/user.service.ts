import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {GithubUsersResult} from '../model/githubUsers-result.model';
import {forkJoin, Observable, of} from 'rxjs';
import {GithubUser} from '../model/github-user.model';
import {ToastrService} from 'ngx-toastr';
import {Repository} from '../model/repository.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private gitHubApi = 'https://api.github.com';
  private usersSearchQuery = '/search/users?q=location:[location]&sort=[sort]&per_page=[per_page]&page=[page]'
  private userFollowersQuery = '/users/[userName]/followers';
  private userReposQuery = '/users/[userName]/repos';
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

  getAllUserRepos(userName): Observable<Repository[]> {
    const searchQuery = this.userReposQuery.replace('[userName]', userName);
    return this.http.get<Repository[]>(this.gitHubApi + searchQuery);
  }

  getAllUserFollowers(userName): Observable<GithubUser[]> {
    const searchQuery = this.userFollowersQuery.replace('[userName]', userName);
    return this.http.get<GithubUser[]>(this.gitHubApi + searchQuery);
  }

  handleError(err: any) {
    if (err.status === 403) {
      this.toastrService.error('Sorry, rate limit on server exceeded. Please wait 60 seconds and try again.', 'Error');
    } else {
      this.toastrService.error(err.message, 'Error');
    }
  }
}
