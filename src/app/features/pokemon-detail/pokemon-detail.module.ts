import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetailRoutingModule } from './pokemon-detail-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { PokeDetailComponent } from './components/poke-detail/poke-detail.component';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
    declarations: [PokeDetailComponent],
    imports: [
        CommonModule,
        PokemonDetailRoutingModule,
        MaterialModule
    ]
})
export class PokemonDetailModule { }