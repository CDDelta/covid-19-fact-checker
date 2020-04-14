import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingShadeComponent } from './loading-shade.component';

@NgModule({
  declarations: [LoadingShadeComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [LoadingShadeComponent],
})
export class LoadingShadeModule {}
