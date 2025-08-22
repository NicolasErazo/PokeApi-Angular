import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, forkJoin } from 'rxjs';

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
  @ViewChild(MatSort) sort!: MatSort;

  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);

  // Tabla
  displayedColumns: string[] = ['id', 'image', 'name', 'types'];
  pokemons = new MatTableDataSource<Pokemon>();

  // Autocomplete
  pokemonCtrl = new FormControl('', [
    Validators.pattern(/^(?!-)\d*$|^[a-zA-Z-]+$/),
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
        this.filteredPokemonNames = [];
        return;
      }

      const id = parseInt(val, 10);
      if (!isNaN(id) && id > 0) {
        // Buscar por ID
        this.searchPokemonById(id);
      } else {
        // Buscar por nombre
        this.searchPokemonByName(val);
      }
    });
  }

  private searchPokemonById(id: number): void {
    this.pokemonService.getPokemonById(id).subscribe({
      next: (pokemon) => {
        const result = pokemon ? [this.adaptFromApi(pokemon)] : [];
        this.pokemons = new MatTableDataSource(result);
        this.pokemons.sort = this.sort;
        this.filteredPokemonNames = [];
      },
      error: () => {
        this.pokemons = new MatTableDataSource<Pokemon>([]);
        this.filteredPokemonNames = [];
      },
    });
  }

  private searchPokemonByName(searchTerm: string): void {
    this.filteredPokemonNames = this.allPokemonNames
      .filter((name) => name.includes(searchTerm))
      .slice(0, 10);

    if (this.allPokemonNames.includes(searchTerm)) {
      this.pokemonService.getPokemonByName(searchTerm).subscribe({
        next: (pokemon) => {
          const result = pokemon ? [this.adaptFromApi(pokemon)] : [];
          this.pokemons = new MatTableDataSource(result);
          this.pokemons.sort = this.sort;
        },
        error: () => {
          this.pokemons = new MatTableDataSource<Pokemon>([]);
        },
      });
    } else if (this.filteredPokemonNames.length > 0) {
      const pokemonsToLoad = this.filteredPokemonNames.slice(0, 20);
      this.pokemonService.getPokemonsByNames(pokemonsToLoad).subscribe({
        next: (pokemons) => {
          const result = pokemons.map((p) => this.adaptFromApi(p));
          this.pokemons = new MatTableDataSource(result);
          this.pokemons.sort = this.sort;
        },
        error: () => {
          this.pokemons = new MatTableDataSource<Pokemon>([]);
        },
      });
    } else {
      this.pokemons = new MatTableDataSource<Pokemon>([]);
    }
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const name = event.option.value;
    this.pokemonService.getPokemonByName(name).subscribe(
      (pokemon) => {
        const result = pokemon ? [this.adaptFromApi(pokemon)] : [];
        this.pokemons = new MatTableDataSource(result);
        this.pokemons.sort = this.sort;
      },
      () => {
        this.pokemons = new MatTableDataSource<Pokemon>([]);
      }
    );
  }

  loadingNames = true;
  loadAllPokemonNames(): void {
    // Cargar todos los pokémon de una vez (la API soporta hasta 100,000)
    this.pokemonService.getPokemonPage(100000, 0).subscribe({
      next: (response) => {
        this.allPokemonNames = response.results.map((p: PokemonListItem) =>
          p.name.toLowerCase()
        );
      },
      error: (err) => {
        console.error('Error loading all names', err);
        // Fallback: cargar por páginas si falla
        this.loadAllPokemonNamesInBatches();
      },
    });
  }

  // Método alternativo por si el anterior falla
  private loadAllPokemonNamesInBatches(): void {
    this.pokemonService.getPokemonPage(1, 0).subscribe({
      next: (firstResponse) => {
        const total = firstResponse.count;
        const pageSize = 1000; // Aumentar el tamaño de página
        const totalPages = Math.ceil(total / pageSize);
        const requests = [];

        for (let i = 0; i < totalPages; i++) {
          requests.push(
            this.pokemonService.getPokemonPage(pageSize, i * pageSize)
          );
        }

        forkJoin(requests).subscribe({
          next: (responses: PokemonListResponse[]) => {
            this.allPokemonNames = responses.flatMap((r) =>
              r.results.map((p: PokemonListItem) => p.name.toLowerCase())
            );
          },
          error: (err) =>
            console.error('Error loading all names in batches', err),
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
          this.totalPokemons = response.count;

          // Traer detalles de cada Pokémon
          const requests = response.results.map((p) =>
            this.pokemonService.getPokemonByName(p.name)
          );

          forkJoin(requests).subscribe({
            next: (pokemons) => {
              const result = pokemons.map((p) => this.adaptFromApi(p));
              this.pokemons = new MatTableDataSource(result);
              this.pokemons.sort = this.sort;
              this.loading = false;
            },
            error: () => {
              this.error = 'No se pudieron cargar los Pokémon';
              this.loading = false;
            },
          });
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

  // TODO: Tipar correctamente este método en vez de `any`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private adaptFromApi(p: any): Pokemon {
    return {
      id: p.id,
      name: p.name,
      imageUrl: p.sprites.other?.['official-artwork']?.front_default ?? '',
      types: p.types,
    };
  }
}
