import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ClaimsRoutingModule } from './claims-routing.module';
import { ClaimsMasterComponent } from './claims-master/claims-master.component';
import { ClaimsDetailComponent } from './claims-detail/claims-detail.component';
import { ClaimsComponent } from './claims.component';
import { TruthfulnessPipe } from './truthfulness.pipe';
import { ClaimsEditComponent } from './claims-edit/claims-edit.component';

@NgModule({
  declarations: [
    ClaimsMasterComponent,
    ClaimsDetailComponent,
    ClaimsComponent,
    TruthfulnessPipe,
    ClaimsEditComponent,
  ],
  imports: [SharedModule, ClaimsRoutingModule],
})
export class ClaimsModule {}
