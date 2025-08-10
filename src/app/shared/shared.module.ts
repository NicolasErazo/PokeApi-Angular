import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [FooterComponent, HeaderComponent],
  imports: [
    CommonModule,
    MaterialModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    NgOptimizedImage,
    FooterComponent,
    HeaderComponent,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
