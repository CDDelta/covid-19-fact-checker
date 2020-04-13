import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Claim, Truthfulness } from '../../models/claim';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

enum ClaimStatusFilter { All = '', Checked = 'checked', Unchecked = 'unchecked' }

@Component({
  selector: 'app-claims-master',
  templateUrl: './claims-master.component.html',
  styleUrls: ['./claims-master.component.scss']
})
export class ClaimsMasterComponent implements OnInit {
  public statusFilter$: BehaviorSubject<ClaimStatusFilter>;
  public truthfulnessFilter$: BehaviorSubject<Truthfulness>;
  public countryFilter$: BehaviorSubject<string>;

  public claims$: Observable<Claim[]>;

  constructor(private db: AngularFirestore, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.statusFilter$ = new BehaviorSubject<ClaimStatusFilter>(this.route.snapshot.queryParams.status);
    this.truthfulnessFilter$ = new BehaviorSubject<Truthfulness>(this.route.snapshot.queryParams.truthfulness);
    this.countryFilter$ = new BehaviorSubject<string>(this.route.snapshot.queryParams.country);

    combineLatest(this.statusFilter$, this.truthfulnessFilter$, this.countryFilter$).subscribe(([status, truthfulness, country]) => this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status,
        truthfulness,
        country,
      }
    }));

    this.claims$ =
      this.route.queryParams
        .pipe(
          switchMap(
            ({ status, truthfulness, country }) => this.db.collection('claims', (ref) => {
              let query = ref.orderBy('hitCount', 'desc');

              if (status === ClaimStatusFilter.Checked)
                query = query.where('checked', '==', true);
              else if (status === ClaimStatusFilter.Unchecked)
                query = query.where('checked', '==', false);

              if (truthfulness)
                query = query.where('truthfulness', '==', truthfulness);

              if (country)
                query = query.where('hitCountryCodes', 'array-contains', country);

              return query;
            })
              .valueChanges({ idField: 'id' }) as Observable<Claim[]>
          )
        );
  }
}
