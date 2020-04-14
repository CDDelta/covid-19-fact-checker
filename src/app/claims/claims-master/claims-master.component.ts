import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Claim, Truthfulness } from '../../models/claim';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, scan, tap, map } from 'rxjs/operators';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-claims-master',
  templateUrl: './claims-master.component.html',
  styleUrls: ['./claims-master.component.scss'],
})
export class ClaimsMasterComponent implements OnInit {
  public truthfulnessFilter$: BehaviorSubject<Truthfulness>;
  public countryFilter$: BehaviorSubject<string>;
  public loadMoreEvent$ = new BehaviorSubject<any>(null);

  public claimsQuery$: Observable<{
    loading: boolean;
    atEnd: boolean;
    claims: Claim[];
  }>;

  private claims$ = new BehaviorSubject<Claim[]>([]);
  private claimsLoading$ = new BehaviorSubject<boolean>(true);
  private claimsCursor: QueryDocumentSnapshot<Claim>;
  private claimsAtEnd = false;

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

    this.route.queryParams
      .pipe(
        tap(() => {
          this.claimsAtEnd = false;
          this.claimsCursor = null;
          this.claims$.next([]);
        }),
        switchMap(({ truthfulness, country }) =>
          this.loadMoreEvent$.pipe(
            tap(() => this.claimsLoading$.next(true)),
            switchMap(() =>
              this.db
                .collection('claims', (ref) => {
                  let query = ref.orderBy('hitCount', 'desc').limit(PAGE_SIZE);

                  if (this.claimsCursor)
                    query = query.startAfter(this.claimsCursor);

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
                .get(),
            ),
            map((snapshot) => {
              if (snapshot.empty || snapshot.size < PAGE_SIZE)
                this.claimsAtEnd = true;

              this.claimsCursor = snapshot.docs[
                snapshot.docs.length - 1
              ] as QueryDocumentSnapshot<Claim>;
              return snapshot.docs.map(
                (d) => ({ id: d.id, ...d.data() } as Claim),
              );
            }),
            tap((p) => p.map((c) => c.content = c.content.replace(/\n/g, '<br>'))),
            scan((whole, page) => whole.concat(page)),
            tap(() => this.claimsLoading$.next(false)),
          ),
        ),
      )
      .subscribe(this.claims$);

    this.claimsQuery$ = combineLatest(this.claimsLoading$, this.claims$).pipe(
      map(([loading, claims]) => ({
        loading,
        atEnd: this.claimsAtEnd,
        claims,
      })),
    );
  }
}
