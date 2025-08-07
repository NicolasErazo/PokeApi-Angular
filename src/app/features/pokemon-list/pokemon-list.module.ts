import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PokemonListRoutingModule } from './pokemon-list-routing.module';

import { MaterialModule } from 'src/app/shared/material.module';
import { PokeTableComponent } from './components/poke-table/poke-table.component';

@NgModule({
    declarations: [
        PokeTableComponent
    ],
    imports: [
        CommonModule,
        PokemonListRoutingModule,
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class PokemonListModule { }
