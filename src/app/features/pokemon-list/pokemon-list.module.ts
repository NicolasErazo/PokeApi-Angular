import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PokemonListRoutingModule } from './pokemon-list-routing.module';

import { PokeTableComponent } from './components/poke-table/poke-table.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
        PokeTableComponent
    ],
    imports: [
        CommonModule,
        PokemonListRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class PokemonListModule { }
