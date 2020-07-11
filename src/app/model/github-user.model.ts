
export class GithubUser {

  login: string;
  avatar_url: string;
  followers: number;
  followers_url: string;
  public_repos: number;
  repos_url: string;
  location: string;
  company: string;
  email: string;
  html_url: string;
  created_at: string

  constructor(login: string,
              avatar_url: string,
              followers: number,
              public_repos: number) {

    this.login = login;
    this.avatar_url = avatar_url;
    this.followers = followers;
    this.public_repos = public_repos;
  }

}
