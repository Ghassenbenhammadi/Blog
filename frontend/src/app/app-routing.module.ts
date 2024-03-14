import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './compoments/login/login.component';
import { RegisterComponent } from './compoments/register/register.component';
import { UsersComponent } from './compoments/users/users.component';

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
    path: 'users', component: UsersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
