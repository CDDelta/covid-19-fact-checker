import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsEditComponent } from './claims-edit.component';

describe('ClaimsEditComponent', () => {
  let component: ClaimsEditComponent;
  let fixture: ComponentFixture<ClaimsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
