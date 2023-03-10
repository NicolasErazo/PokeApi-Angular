import { Component } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { ActivatedRoute } from '@angular/router';

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
    this.pokemonService.getPokemons(id).subscribe(
      res => {
        // console.log(res);
        this.pokemon = res;
        this.pokemonImgFront = this.pokemon.sprites.other.home.front_default;
        this.pokemonImgShiny = this.pokemon.sprites.other.home.front_shiny;
        this.pokemonType = res.types[0].type.name;
      },
      err => {
        console.log(err);
      }
    )
  }


}
