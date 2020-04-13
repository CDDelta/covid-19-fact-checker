import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
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
    (this.route.params.pipe(
      switchMap((params) => this.db.doc(`/claims/${params.id}`).valueChanges()),
    ) as Observable<Claim>).subscribe(this.claim$);
  }

  openEditDialog(): void {
    this.dialog.open(ClaimsEditComponent, {
      data: this.claim$.value,
    });
  }
}
