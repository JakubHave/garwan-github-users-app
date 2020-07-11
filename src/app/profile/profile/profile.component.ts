import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userName: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.loggedUserValue) {
      this.userName = this.authService.loggedUserValue.name;
    }

  }

}
