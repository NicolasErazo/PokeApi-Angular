import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PokemonDetail } from '../../models/pokemon-detail.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './poke-detail.component.html',
  styleUrls: ['./poke-detail.component.scss'],
})
export class DetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);

  pokemon!: PokemonDetail;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadPokemon();
  }

  private loadPokemon(): void {
    const pokemonId = this.route.snapshot.paramMap.get('id');

    if (!pokemonId) {
      this.error = 'No Pokémon ID provided';
      this.loading = false;
      return;
    }

    this.pokemonService.getPokemonById(+pokemonId).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load Pokémon details';
        this.loading = false;
        console.error(err);
      },
    });
  }

  // Helpers para la vista
  get pokemonImage(): string {
    return (
      this.pokemon?.sprites?.other?.['official-artwork']?.front_default || ''
    );
  }

  get pokemonTypes(): string[] {
    return this.pokemon?.types?.map((t) => t.type.name) || [];
  }

  get formattedWeight(): string {
    return this.pokemon ? `${(this.pokemon.weight / 10).toFixed(1)} kg` : '';
  }

  get formattedHeight(): string {
    return this.pokemon ? `${(this.pokemon.height / 10).toFixed(1)} m` : '';
  }

  navigateBack(): void {
    this.router.navigate(['/pokemon']);
  }
}
