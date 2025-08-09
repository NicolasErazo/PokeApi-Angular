// src/app/features/pokemon/pokemon.module.ts
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PokemonCardComponent } from './components/pokemon-card/pokemon-card.component';
import { DetailPageComponent } from './pages/detail-page/poke-detail.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

@NgModule({
  declarations: [PokemonCardComponent, DetailPageComponent, HomePageComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: '', component: HomePageComponent },
      { path: 'detail/:id', component: DetailPageComponent },
    ]),
  ],
  exports: [PokemonCardComponent],
})
export class PokemonModule {}
