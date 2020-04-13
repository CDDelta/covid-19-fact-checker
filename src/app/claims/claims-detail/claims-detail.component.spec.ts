import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsDetailComponent } from './claims-detail.component';

describe('ClaimsDetailComponent', () => {
  let component: ClaimsDetailComponent;
  let fixture: ComponentFixture<ClaimsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
