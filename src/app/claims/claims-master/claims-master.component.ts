import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Claim } from '../../models/claim';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

enum ClaimStatusFilter { All = 'all', Checked = 'checked', Unchecked = 'unchecked' }

@Component({
  selector: 'app-claims-master',
  templateUrl: './claims-master.component.html',
  styleUrls: ['./claims-master.component.scss']
})
export class ClaimsMasterComponent implements OnInit {
  public statusFilter$: BehaviorSubject<ClaimStatusFilter>;

  public claims$: Observable<Claim[]>;

  constructor(private db: AngularFirestore, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.statusFilter$ = new BehaviorSubject<ClaimStatusFilter>(this.route.snapshot.queryParams.status);

    combineLatest(this.statusFilter$).subscribe(([status]) => this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status,
      }
    }));

    this.claims$ =
      this.route.queryParams
        .pipe(
          switchMap(
            ({ status }) => this.db.collection('claims', (ref) => {
              let query = ref.orderBy('hitCount', 'desc');

              if (status === ClaimStatusFilter.Checked)
                query = ref.where('checked', '==', true);
              else if (status === ClaimStatusFilter.Unchecked)
                query = ref.where('checked', '==', false);

              return query;
            })
              .valueChanges({ idField: 'id' }) as Observable<Claim[]>
          )
        );
  }
}
