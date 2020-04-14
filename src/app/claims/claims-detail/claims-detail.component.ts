import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { Claim } from '../../models/claim';
import { MatDialog } from '@angular/material/dialog';
import { ClaimsEditComponent } from '../claims-edit/claims-edit.component';
import { AggregatedHitBucket } from 'functions/src/models/aggregatedHitBucket';

@Component({
  selector: 'app-claims-detail',
  templateUrl: './claims-detail.component.html',
  styleUrls: ['./claims-detail.component.scss'],
})
export class ClaimsDetailComponent implements OnInit {
  public claim$ = new BehaviorSubject<Claim>(null);
  public pastWeekHitsData$: Observable<any>;
  public countryHitsData$: Observable<any>;

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
            .pipe(
              tap((c: Claim) => {
                c.id = params.id;
                c.content = c.content.replace(/\n/g, '<br>');
              }),
            ),
        ),
      )
      .subscribe(this.claim$);

    const aggregatedHits$ = this.route.params.pipe(
      switchMap(
        (params) =>
          this.db
            .collection(`/claims/${params.id}/daily_aggregated_hits`, (ref) =>
              ref
                .where('date', '>=', this.getStartOfPastDay(7))
                .orderBy('date')
                .limit(7),
            )
            .valueChanges() as Observable<AggregatedHitBucket[]>,
      ),
    );

    this.pastWeekHitsData$ = aggregatedHits$.pipe(
      map((buckets) => [
        {
          name: 'Hits',
          series: buckets.map((b) => ({
            name: b.date.toDate().toUTCString(),
            value: Object.keys(b.countryCodes).reduce(
              (sum, countryCode) => sum + b.countryCodes[countryCode],
              0,
            ),
          })),
        },
      ]),
    );

    this.countryHitsData$ = aggregatedHits$.pipe(
      map((buckets) => {
        const countrySumMap = {};
        for (const bucket of buckets)
          for (const country in bucket.countryCodes)
            countrySumMap[country] =
              (countrySumMap[country] ?? 0) + bucket.countryCodes[country];

        const countrySums = [];
        for (const country in countrySumMap)
          countrySums.push({
            name: country,
            value: countrySumMap[country],
          });

        return countrySums;
      }),
    );
  }

  getStartOfPastDay(daysBefore: number) {
    const d = new Date();
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();

    return firestore.Timestamp.fromMillis(
      Date.UTC(year, month, day - daysBefore, 0, 0, 0, 0),
    );
  }

  openEditDialog(): void {
    this.dialog.open(ClaimsEditComponent, {
      width: '95%',
      maxWidth: '60rem',
      data: this.claim$.value,
    });
  }
}
