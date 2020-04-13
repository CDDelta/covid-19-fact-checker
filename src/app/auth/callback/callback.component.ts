import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private auth: AngularFireAuth, private location: PlatformLocation, private router: Router) { }

  ngOnInit(): void {
    this.attemptSignInWithEmailLink();
  }

  async attemptSignInWithEmailLink(): Promise<void> {
    const isSignInLink = await this.auth.isSignInWithEmailLink(this.location.href);
    const email = localStorage.getItem('signInEmail');

    if (isSignInLink && email)
      await this.auth.signInWithEmailLink(email, this.location.href);

    this.router.navigate(['']);
  }
}
