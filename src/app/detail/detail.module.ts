import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import {RouterModule} from '@angular/router';
import {NgbNavModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'detail/:name',
        component: DetailComponent
      }
    ]),
    NgbNavModule,
    NgbPaginationModule
  ]
})
export class DetailModule { }
