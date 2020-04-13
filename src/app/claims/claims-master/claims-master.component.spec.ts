import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsMasterComponent } from './claims-master.component';

describe('ClaimsMasterComponent', () => {
  let component: ClaimsMasterComponent;
  let fixture: ComponentFixture<ClaimsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
