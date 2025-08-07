import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        NgOptimizedImage
    ],
    exports: [
        CommonModule,
        MaterialModule,
        NgOptimizedImage
    ]
})
export class SharedModule { }