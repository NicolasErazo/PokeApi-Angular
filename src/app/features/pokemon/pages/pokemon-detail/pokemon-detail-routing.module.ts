import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PokeDetailComponent } from './components/poke-detail/poke-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PokeDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PokemonDetailRoutingModule {}
