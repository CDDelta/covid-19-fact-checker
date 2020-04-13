import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Claim } from '../../models/claim';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

enum CheckFilterState { All = '', Checked = 'checked', Unchecked = 'unchecked' }

@Component({
  selector: 'app-claims-master',
  templateUrl: './claims-master.component.html',
  styleUrls: ['./claims-master.component.scss']
})
export class ClaimsMasterComponent implements OnInit {

  public checkedFilter$ = new BehaviorSubject<CheckFilterState>(CheckFilterState.Unchecked);

  public claims$: Observable<Claim[]>;

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.claims$ =
      combineLatest(this.checkedFilter$)
        .pipe(
          switchMap(
            () => this.db.collection('claims', (ref) => ref.orderBy('hitCount', 'desc'))
              .valueChanges({ idField: 'id' }) as Observable<Claim[]>
          )
        );
  }
}
