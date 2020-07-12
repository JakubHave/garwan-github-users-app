import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Issue} from '../../model/issue.model';
import {UserService} from '../../services/user.service';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';

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
  unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {
    if (this.authService.loggedUserValue) {
      this.userName = this.authService.loggedUserValue.name;

      this.getIssues(this.perPage, 1);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  pageIssueChanged(pageNum: number) {
    this.getIssues(this.perPage, pageNum);
  }

  private getIssues(perPage: number, pageNum: number) {
    this.userService.getIssues(perPage, pageNum)
    // unsubscribe observable on unsubscribe$ emission in ngOnDestroy or after first execution,
    // another option is to use async pipe in html
      .pipe(takeUntil(this.unsubscribe$), take(1))
      .subscribe(
      res => {
        this.issues = res.issues;
        if (res.lastPageNum) {
          this.issuesSizeCeil = res.lastPageNum * perPage;
        }
      }, err => this.userService.handleError(err)
    );
  }
}
