import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetailRoutingModule } from './pokemon-detail-routing.module';
import { PokeDetailComponent } from 'src/app/features/pokemon-detail/components/poke-detail/poke-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [PokeDetailComponent],
    imports: [
        CommonModule,
        PokemonDetailRoutingModule,
        SharedModule
    ]
})
export class PokemonDetailModule { }