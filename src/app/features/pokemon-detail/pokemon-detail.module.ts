import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetailRoutingModule } from './pokemon-detail-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { PokeDetailComponent } from 'src/app/features/pokemon-detail/components/poke-detail/poke-detail.component';

@NgModule({
    declarations: [PokeDetailComponent],
    imports: [
        CommonModule,
        PokemonDetailRoutingModule,
        MaterialModule
    ]
})
export class PokemonDetailModule { }