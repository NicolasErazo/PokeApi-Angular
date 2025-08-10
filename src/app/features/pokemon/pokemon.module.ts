// src/app/features/pokemon/pokemon.module.ts
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { PokemonCardComponent } from './components/pokemon-card/pokemon-card.component';
import { DetailPageComponent } from './pages/detail-page/poke-detail.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

@NgModule({
  declarations: [PokemonCardComponent, DetailPageComponent, HomePageComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: HomePageComponent },
      { path: 'pokemon/:id', component: DetailPageComponent },
    ]),
  ],
  exports: [PokemonCardComponent, SharedModule],
})
export class PokemonModule {}
