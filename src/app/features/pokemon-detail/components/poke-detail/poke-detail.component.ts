import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from 'src/app/features/pokemon/interfaces';

@Component({
  selector: 'app-poke-detail',
  templateUrl: './poke-detail.component.html',
  styleUrls: ['./poke-detail.component.scss']
})
export class PokeDetailComponent implements OnInit {

  pokemon!: Pokemon;
  pokemonImgFront: string = '';
  pokemonImgShiny: string = '';
  pokemonType: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = +params['id'];
      this.getPokemon(id);
    });
  }

  getPokemon(id: number): void {
    this.pokemonService.getPokemons(id).subscribe({
      next: (poke: Pokemon) => {
        this.pokemon = poke;
        this.pokemonImgFront = poke.sprites?.other?.home?.front_default || '';
        this.pokemonImgShiny = poke.sprites?.other?.home?.front_shiny || '';
        this.pokemonType = poke.types.map(t => t.type.name);
      },
      error: err => {
        console.error('Error fetching Pokémon', err);
      }
    });
  }
}