import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageSpinnerComponent } from './page-spinner.component';

@NgModule({
  declarations: [PageSpinnerComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [PageSpinnerComponent],
})
export class PageSpinnerModule { }
