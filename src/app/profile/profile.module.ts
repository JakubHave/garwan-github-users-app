import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import {RouterModule} from '@angular/router';
import {DetailComponent} from '../detail/detail/detail.component';



@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'profile',
        component: ProfileComponent
      }
    ])
  ]
})
export class ProfileModule { }
