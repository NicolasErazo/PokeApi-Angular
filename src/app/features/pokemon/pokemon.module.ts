// src/app/features/pokemon/pokemon.module.ts
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailPageComponent } from './pages/detail-page/poke-detail.component';

// Components

@NgModule({
  declarations: [
    PokemonCardComponent,
    PokemonListComponent,
    DetailPageComponent,
    HomePageComponent,
  ],
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
