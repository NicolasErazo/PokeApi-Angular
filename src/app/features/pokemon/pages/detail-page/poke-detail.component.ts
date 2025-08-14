import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PokemonApiDetailResponse } from '../../models';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-poke-detail',
  templateUrl: './poke-detail.component.html',
  styleUrls: ['./poke-detail.component.scss'],
})
export class DetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);

  pokemon?: PokemonApiDetailResponse;
  loading = true;

  // Propiedades para las imágenes
  pokemonImgFront = '';
  pokemonImgShiny = '';
  pokemonImgOfficial = '';

  totalPokemons = 0;

  randomNumber = 0;

  ngOnInit() {
    // Obtener total de pokémon
    this.pokemonService.getTotalPokemons().subscribe((count) => {
      this.totalPokemons = count;
    });

    // Escuchar cambios de ID en la ruta
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadPokemon(+id);
      }
    });
  }

  loadPokemon(id: number): void {
    this.loading = true;
    this.pokemonService.getPokemonById(id).subscribe(
      (pokemon) => {
        if (pokemon) {
          this.pokemon = pokemon;
          this.setPokemonImages();
        } else {
          this.pokemon = undefined;
        }
        this.loading = false;
      },
      (err: Error | HttpErrorResponse) => {
        console.error('Error loading Pokémon', err);
        this.loading = false;
      }
    );
  }

  private setPokemonImages(): void {
    if (!this.pokemon) return;

    this.pokemonImgFront =
      this.pokemon.sprites.other?.['official-artwork']?.front_default || '';

    this.pokemonImgShiny =
      this.pokemon.sprites.other?.['official-artwork']?.front_shiny || '';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getWeight(): string {
    return this.pokemon ? `${(this.pokemon.weight / 10).toFixed(1)} kg` : 'N/A';
  }

  getHeight(): string {
    return this.pokemon ? `${(this.pokemon.height / 10).toFixed(1)} m` : 'N/A';
  }

  getStatValue(statName: string): number {
    if (!this.pokemon) return 0;
    const stat = this.pokemon.stats.find((s) => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  }

  shuffle() {
    if (this.totalPokemons > 0) {
      this.randomNumber = Math.floor(Math.random() * this.totalPokemons) + 1;
      this.router.navigateByUrl(`/pokemon/${this.randomNumber}`);
    }
  }
}
