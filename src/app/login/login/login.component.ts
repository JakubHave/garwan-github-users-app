import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;

  userForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private toastrService: ToastrService) { }

  ngOnInit() {
    if (this.authService.getCredentials()) {
      this.isLoggedIn = true;
    }
  }

  onSubmit() {
    this.authService.login(this.userForm,
      () => {
        this.toastrService.success('Successfully logged in!', 'Success');
        this.reloadPage();
      },
      () => this.toastrService.error('Bad credentials!', 'Error')
      );
  }

  reloadPage() {
    window.location.reload();
  }
}
