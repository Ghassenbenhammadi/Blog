import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './compoments/login/login.component';
import { RegisterComponent } from './compoments/register/register.component';
import { UsersComponent } from './compoments/users/users.component';
import { UserProfileComponent } from './compoments/user-profile/user-profile.component';

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
  {
    path: 'users/:id', component: UserProfileComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
