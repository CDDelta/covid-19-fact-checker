import { Component, ViewChild, Input } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatInput } from '@angular/material/input';
import { FormBuilder, Validators } from '@angular/forms';

enum SignInState { Waiting = 'waiting', SendingEmail = 'sending_email', SentEmail = 'sent_email' };

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public state = SignInState.Waiting;

  constructor(private auth: AngularFireAuth, private location: PlatformLocation, private fb: FormBuilder) { }

  async sendSignInEmail(): Promise<void> {
    this.state = SignInState.SendingEmail;

    try {
      const email = this.form.value.email;

      await this.auth.sendSignInLinkToEmail(email, {
        url: `${this.location.protocol}//${this.location.hostname}/account/callback`,
        handleCodeInApp: true,
      });

      localStorage.setItem('signInEmail', email);
    } catch {
      this.state = SignInState.Waiting;
    }

    this.state = SignInState.SentEmail;
  }
}
