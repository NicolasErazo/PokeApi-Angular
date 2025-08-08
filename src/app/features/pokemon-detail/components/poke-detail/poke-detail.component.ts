import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { Pokemon } from 'src/app/features/pokemon/interfaces';

@Component({
  selector: 'app-poke-detail',
  templateUrl: './poke-detail.component.html',
  styleUrls: ['./poke-detail.component.scss']
})
export class PokeDetailComponent implements OnInit {

  pokemon!: Pokemon;
  pokemonImgFront = '';
  pokemonImgShiny = '';
  pokemonType: string[] = [];

  activatedRoute = inject(ActivatedRoute);
  pokemonService = inject(PokemonService);
  router = inject(Router);

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

  goBack(): void {
    this.router.navigateByUrl(`/`);
  }

  /**
   * Capitaliza la primera letra de un string
   */
  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  /**
   * Convierte hectogramos a kilogramos
   */
  getWeight(): string {
    return (this.pokemon.weight / 10).toFixed(1) + ' kg';
  }

  /**
   * Convierte decímetros a metros
   */
  getHeight(): string {
    return (this.pokemon.height / 10).toFixed(1) + ' m';
  }

}