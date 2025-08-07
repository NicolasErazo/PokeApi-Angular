import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

@NgModule({
    exports: [
        CommonModule,
        MaterialModule
    ]
})
export class SharedModule { }