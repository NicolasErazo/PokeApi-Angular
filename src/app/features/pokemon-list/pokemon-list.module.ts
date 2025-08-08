import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { PokeTableComponent } from './components/poke-table/poke-table.component';
import { PokemonListRoutingModule } from './pokemon-list-routing.module';

@NgModule({
  declarations: [PokeTableComponent],
  imports: [
    CommonModule,
    PokemonListRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CdkTableModule,
  ],
})
export class PokemonListModule {}
