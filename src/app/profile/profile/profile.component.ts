import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Issue} from '../../model/issue.model';
import {UserService} from '../../services/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userName: string;
  issues: Issue[];
  pageIssue = 1;
  perPage = 5;
  issuesSizeCeil: number;
  issuesSubscription: Subscription;

  constructor(private authService: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {
    if (this.authService.loggedUserValue) {
      this.userName = this.authService.loggedUserValue.name;

      this.getIssues(this.perPage, 1);
    }
  }

  ngOnDestroy(): void {
    if (this.issuesSubscription) { this.issuesSubscription.unsubscribe(); }
  }

  pageIssueChanged(pageNum: number) {

  }

  private getIssues(perPage: number, pageNum: number) {
    this.issuesSubscription = this.userService.getIssues(perPage, 1).subscribe(
      res => {
        this.issues = res.issues;
        this.issuesSizeCeil = res.lastPageNum * perPage;
      }, err => this.userService.handleError(err)
    );
  }
}
