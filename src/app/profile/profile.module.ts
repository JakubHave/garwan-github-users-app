import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';
import { RouteGuard } from '../services/route.guard';



@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [RouteGuard]
      }
    ])
  ]
})
export class ProfileModule { }
