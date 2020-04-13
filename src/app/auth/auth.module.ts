import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { CallbackComponent } from './callback/callback.component';


@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [SignInComponent, CallbackComponent]
})
export class AuthModule { }
