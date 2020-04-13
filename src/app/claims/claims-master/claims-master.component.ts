import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Claim, Truthfulness } from '../../models/claim';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-claims-master',
  templateUrl: './claims-master.component.html',
  styleUrls: ['./claims-master.component.scss'],
})
export class ClaimsMasterComponent implements OnInit {
  public truthfulnessFilter$: BehaviorSubject<Truthfulness>;
  public countryFilter$: BehaviorSubject<string>;

  public claims$: Observable<Claim[]>;

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.truthfulnessFilter$ = new BehaviorSubject<Truthfulness>(
      this.route.snapshot.queryParams.truthfulness,
    );
    this.countryFilter$ = new BehaviorSubject<string>(
      this.route.snapshot.queryParams.country,
    );

    combineLatest(this.truthfulnessFilter$, this.countryFilter$).subscribe(
      ([truthfulness, country]) =>
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            truthfulness,
            country,
          },
        }),
    );

    this.claims$ = this.route.queryParams.pipe(
      switchMap(
        ({ truthfulness, country }) =>
          this.db
            .collection('claims', (ref) => {
              let query = ref.orderBy('hitCount', 'desc');

              if (truthfulness)
                query = query.where('truthfulness', '==', truthfulness);

              if (country)
                query = query.where(
                  'hitCountryCodes',
                  'array-contains',
                  country,
                );

              return query;
            })
            .valueChanges({ idField: 'id' }) as Observable<Claim[]>,
      ),
    );
  }
}
