import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { PokeDetailComponent } from './components/poke-detail/poke-detail.component';
import { PokemonDetailRoutingModule } from './pokemon-detail-routing.module';

@NgModule({
  declarations: [PokeDetailComponent],
  imports: [CommonModule, PokemonDetailRoutingModule, SharedModule],
})
export class PokemonDetailModule {}
