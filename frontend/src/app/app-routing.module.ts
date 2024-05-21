import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './compoments/login/login.component';
import { RegisterComponent } from './compoments/register/register.component';
import { UsersComponent } from './compoments/users/users.component';
import { UserProfileComponent } from './compoments/user-profile/user-profile.component';
import { UpdateUserProfileComponent } from './compoments/update-user-profile/update-user-profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path:'admin', loadChildren:()=> import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path:'login', component: LoginComponent,
  },
  {
    path:'register', component: RegisterComponent,
  },
  {
    path: 'update-profile',
    component: UpdateUserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    children: [
      {
        path:'',
        component: UsersComponent
      },
      {
        path:':id',
        component: UserProfileComponent
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
