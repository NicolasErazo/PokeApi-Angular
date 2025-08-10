import { Component, inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';

import {
  Pokemon,
  PokemonListItem,
  PokemonListResponse,
} from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);

  // Tabla
  displayedColumns: string[] = ['id', 'image', 'name', 'types'];
  pokemons: Pokemon[] = [];

  // Autocomplete
  pokemonCtrl = new FormControl('', [
    Validators.pattern(/^(?!-)\d*$|^[a-zA-Z]+$/),
  ]);
  allPokemonNames: string[] = [];
  filteredPokemonNames: string[] = [];

  // Paginación
  pageSize = 10;
  pageIndex = 0;
  totalPokemons = 0;

  randomNumber = 0;

  // Estado
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadPokemons();
    this.loadAllPokemonNames();

    this.pokemonCtrl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      const val = (value || '').toString().trim().toLowerCase();

      // Si empieza con "-" → reiniciar
      if (val.startsWith('-')) {
        this.pokemonCtrl.setValue('', { emitEvent: false });
        this.loadPokemons();
        return;
      }

      // Si está vacío → recargar lista completa
      if (!val) {
        this.loadPokemons();
        return;
      }

      const id = parseInt(val, 10);
      if (!isNaN(id) && id > 0) {
        // Buscar por ID
        this.pokemonService.getPokemonById(id).subscribe(
          (pokemon) => {
            if (pokemon !== null) {
              this.pokemons = [
                {
                  id: pokemon.id,
                  name: pokemon.name,
                  imageUrl:
                    pokemon.sprites.other?.['official-artwork']
                      ?.front_default ?? '',
                  types: pokemon.types,
                },
              ];
            } else {
              this.pokemons = [];
            }
          },
          () => (this.pokemons = [])
        );
      } else {
        // Filtrar nombres para el autocomplete
        this.filteredPokemonNames = this.allPokemonNames.filter((name) =>
          name.includes(val)
        );

        // Si el valor escrito es un nombre exacto, buscar solo ese
        if (this.allPokemonNames.includes(val)) {
          this.pokemonService.getPokemonByName(val).subscribe(
            (pokemon) => {
              if (pokemon) {
                this.pokemons = [pokemon];
              } else {
                this.pokemons = [];
              }
            },
            () => (this.pokemons = [])
          );
        }
        // Si no es exacto pero hay coincidencias parciales, traerlos todos
        else if (this.filteredPokemonNames.length > 0) {
          this.pokemonService
            .getPokemonsByNames(this.filteredPokemonNames)
            .subscribe(
              (pokemons) => {
                this.pokemons = pokemons.map((p) => p);
              },
              () => (this.pokemons = [])
            );
        } else {
          this.pokemons = [];
        }
      }
    });
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const name = event.option.value;
    this.pokemonService.getPokemonByName(name).subscribe(
      (pokemon) => {
        if (pokemon !== null) {
          this.pokemons = [pokemon];
        } else {
          this.pokemons = [];
        }
      },
      () => (this.pokemons = [])
    );
  }

  loadAllPokemonNames(): void {
    // Paso 1: obtener el total de pokémon
    this.pokemonService.getPokemonPage(1, 0).subscribe({
      next: (firstResponse) => {
        const total = firstResponse.count;

        // Paso 2: obtener todos con el total
        this.pokemonService.getPokemonPage(total, 0).subscribe({
          next: (fullResponse: PokemonListResponse) => {
            this.allPokemonNames = fullResponse.results.map(
              (p: PokemonListItem) => p.name
            );
          },
          error: (err) => console.error('Error loading all names', err),
        });
      },
      error: (err) => console.error('Error getting total count', err),
    });
  }

  loadPokemons(): void {
    this.loading = true;
    this.pokemonService
      .getPokemons(this.pageSize, this.pageIndex * this.pageSize)
      .subscribe({
        next: (response) => {
          this.pokemons = response.results;
          this.totalPokemons = response.count;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudieron cargar los Pokémon';
          this.loading = false;
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadPokemons();
  }

  viewPokemonDetail(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  generateRandomNumber() {
    if (this.totalPokemons > 0) {
      this.randomNumber = Math.floor(Math.random() * this.totalPokemons) + 1;
      this.router.navigateByUrl(`/pokemon/${this.randomNumber}`);
    }
  }
}
