import { Component } from '@angular/core';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from 'src/app/features/pokemon/interfaces';

@Component({
  selector: 'app-poke-detail',
  templateUrl: './poke-detail.component.html',
  styleUrls: ['./poke-detail.component.scss']
})
export class PokeDetailComponent {

  pokemon: any = '';
  pokemonImgFront = '';
  pokemonImgShiny = '';
  pokemonType = [];

  constructor(private activatedRouter: ActivatedRoute,
    private pokemonService: PokemonService) {
    //obtiene parametro de la url
    this.activatedRouter.params.subscribe(
      params => {
        this.getPokemon(params['id']);
      }
    )
  }

  getPokemon(id: number) {
    this.pokemonService.getPokemon(+id).subscribe((poke: Pokemon) => {
      this.pokemon = poke;
    });
  }
}
