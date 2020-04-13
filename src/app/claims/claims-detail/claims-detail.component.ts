import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Claim } from '../../models/claim';

@Component({
  selector: 'app-claims-detail',
  templateUrl: './claims-detail.component.html',
  styleUrls: ['./claims-detail.component.scss']
})
export class ClaimsDetailComponent implements OnInit {

  public claim$: Observable<Claim>;

  constructor(private db: AngularFirestore, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.claim$ = this.route.params.pipe(switchMap((params) => this.db.doc(`/claims/${params.id}`).valueChanges())) as Observable<Claim>;
  }

}
