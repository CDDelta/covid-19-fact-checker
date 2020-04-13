import { Component, ViewChild, Input } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatInput } from '@angular/material/input';

enum SignInState { Waiting = 'waiting', SendingEmail = 'sending_email', SentEmail = 'sent_email' };

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  public state = SignInState.Waiting;

  @ViewChild('emailInput', { read: MatInput })
  private emailInput: MatInput;

  constructor(private auth: AngularFireAuth, private location: PlatformLocation) { }

  async sendSignInEmail(): Promise<void> {
    this.state = SignInState.SendingEmail;

    try {
      await this.auth.sendSignInLinkToEmail(this.emailInput.value, {
        url: `${this.location.protocol}//${this.location.hostname}/account/callback`,
        handleCodeInApp: true,
      });

      localStorage.setItem('signInEmail', this.emailInput.value);
    } catch {
      this.state = SignInState.Waiting;
    }

    this.state = SignInState.SentEmail;
  }

}
