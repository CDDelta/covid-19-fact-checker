import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { CallbackComponent } from './callback/callback.component';
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectAuthorizedToBase = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: 'sign-in',
    ...canActivate(redirectAuthorizedToBase),
    component: SignInComponent,
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
