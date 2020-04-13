import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimsComponent } from './claims.component';
import { ClaimsMasterComponent } from './claims-master/claims-master.component';
import { ClaimsDetailComponent } from './claims-detail/claims-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ClaimsComponent,
    children: [
      {
        path: '',
        component: ClaimsMasterComponent,
      },
      {
        path: ':id',
        component: ClaimsDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsRoutingModule {}
