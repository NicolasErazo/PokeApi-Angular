import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PokemonListRoutingModule } from './pokemon-list-routing.module';
import { PokeTableComponent } from './components/poke-table/poke-table.component';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
    declarations: [
        PokeTableComponent
    ],
    imports: [
        CommonModule,
        PokemonListRoutingModule,
        MaterialModule,
        NgOptimizedImage
    ]
})
export class PokemonListModule { }