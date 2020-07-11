import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';
import { RouteGuard } from '../services/route.guard';
import {DetailModule} from '../detail/detail.module';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';



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
    ]),
    DetailModule,
    NgbPaginationModule
  ]
})
export class ProfileModule { }
