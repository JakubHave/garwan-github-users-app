import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  error: any;
  userForm = this.formBuilder.group({
    token: ['', Validators.required],
  });

  constructor(private authService: AuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService) { }

  ngOnInit() {
    if (this.authService.loggedUserValue) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {

    this.authService.login(this.userForm.value.token)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/profile']);
        },
        error => {
          this.error = error;
          this.toastrService.error('Could not login with specified token!', 'Error');
        });
  }
}
