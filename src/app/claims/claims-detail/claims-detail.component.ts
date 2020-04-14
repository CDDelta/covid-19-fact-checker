import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Claim } from '../../models/claim';
import { MatDialog } from '@angular/material/dialog';
import { ClaimsEditComponent } from '../claims-edit/claims-edit.component';

@Component({
  selector: 'app-claims-detail',
  templateUrl: './claims-detail.component.html',
  styleUrls: ['./claims-detail.component.scss'],
})
export class ClaimsDetailComponent implements OnInit {
  public claim$ = new BehaviorSubject<Claim>(null);

  constructor(
    public auth: AngularFireAuth,
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) =>
          this.db
            .doc(`/claims/${params.id}`)
            .valueChanges()
            .pipe(tap((c: Claim) => (c.id = params.id))),
        ),
      )
      .subscribe(this.claim$);
  }

  openEditDialog(): void {
    this.dialog.open(ClaimsEditComponent, {
      width: '95%',
      maxWidth: '60rem',
      data: this.claim$.value,
    });
  }
}
