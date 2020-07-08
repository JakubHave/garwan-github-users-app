import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { ProfileModule } from './profile/profile.module';
import { DetailModule } from './detail/detail.module';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const appRoutes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadChildren: () => import('./profile/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    LoginModule,
    HomeModule,
    DetailModule,
    ProfileModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
