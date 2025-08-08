import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';

@NgModule({
  imports: [CommonModule, MaterialModule, NgOptimizedImage],
  exports: [CommonModule, MaterialModule, NgOptimizedImage],
})
export class SharedModule {}
