import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [FooterComponent, HeaderComponent],
  imports: [CommonModule, MaterialModule, NgOptimizedImage],
  exports: [
    CommonModule,
    MaterialModule,
    NgOptimizedImage,
    FooterComponent,
    HeaderComponent,
  ],
})
export class SharedModule {}
