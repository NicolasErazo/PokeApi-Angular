import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokeTableComponent } from './components/poke-table/poke-table.component';

const routes: Routes = [
    {
        path: '',
        component: PokeTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PokemonListRoutingModule { }