import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, forkJoin, Observable } from 'rxjs';
import { NamedAPIResource } from 'src/app/core/services/interfaces/api-response.interface';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { Pokemon } from 'src/app/features/pokemon/interfaces';

@Component({
  selector: 'app-poke-table',
  templateUrl: './poke-table.component.html',
  styleUrls: ['./poke-table.component.scss'],
})
export class PokeTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'image', 'name'];
  dataSource = new MatTableDataSource<PokemonTableRow>([]);

  positionTotal = 0;
  pageSize = 10;
  currentPage = 0;

  pokemonCtrl = new FormControl('', [
    Validators.pattern(/^(?!-)\d*$|^[a-zA-Z]+$/),
  ]);
  allPokemonNames: string[] = [];
  filteredPokemonNames: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pokeService = inject(PokemonService);
  router = inject(Router);

  ngOnInit(): void {
    this.loadPokemons();
    this.loadAllPokemonNames();

    this.pokemonCtrl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      const val = (value || '').toString().trim().toLowerCase();

      // Si se ingresa un número negativo, borrar y cargar todos
      if (val.startsWith('-')) {
        this.pokemonCtrl.setValue('', { emitEvent: false }); // Borra el valor sin disparar nuevo evento
        this.loadPokemons(); // Carga todos los Pokémon
        return;
      }

      if (!val) {
        this.loadPokemons();
        return;
      }

      const id = parseInt(val, 10);
      if (!isNaN(id)) {
        if (id <= 0) {
          // Si es cero o negativo
          this.pokemonCtrl.setValue('', { emitEvent: false });
          this.loadPokemons();
          return;
        }
        this.pokeService.getPokemonById(id).subscribe(
          (pokemon) => {
            this.dataSource.data = [this.mapToTableRow(pokemon)];
          },
          () => (this.dataSource.data = [])
        );
      } else {
        const filtered = this.allPokemonNames.filter((name) =>
          name.includes(val)
        );
        this.filteredPokemonNames = filtered;

        if (this.allPokemonNames.includes(val)) {
          this.pokeService.getPokemonByName(val).subscribe(
            (pokemon) => {
              this.dataSource.data = [this.mapToTableRow(pokemon)];
            },
            () => (this.dataSource.data = [])
          );
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const name = event.option.value;
    this.pokeService.getPokemonByName(name).subscribe(
      (pokemon) => {
        this.dataSource.data = [this.mapToTableRow(pokemon)];
      },
      () => (this.dataSource.data = [])
    );
  }

  loadAllPokemonNames(): void {
    this.pokeService.getPokemonPage(1000, 0).subscribe({
      next: (response: { count: number; results: NamedAPIResource[] }) => {
        this.allPokemonNames = response.results.map(
          (p: NamedAPIResource) => p.name
        );
      },
      error: (err) => console.error('Error loading names', err),
    });
  }

  loadPokemons(): void {
    const offset = this.currentPage * this.pageSize;

    this.pokeService.getPokemonPage(this.pageSize, offset).subscribe({
      next: (response: { count: number; results: NamedAPIResource[] }) => {
        const requests: Observable<Pokemon>[] = response.results.map(
          (pokemon: NamedAPIResource) =>
            this.pokeService.getPokemonByUrl(pokemon.url)
        );

        forkJoin(requests).subscribe({
          next: (results: Pokemon[]) => {
            // Asigna los datos primero
            this.dataSource.data = results.map((res) =>
              this.mapToTableRow(res)
            );
            this.positionTotal = response.count;

            // Actualiza el paginador después de asignar los datos
            setTimeout(() => {
              if (this.paginator) {
                this.paginator.length = this.positionTotal;
                this.paginator.pageIndex = this.currentPage;
                this.paginator.pageSize = this.pageSize;
              }
            });
          },
          error: (err) => this.handleError(err),
        });
      },
      error: (err) => this.handleError(err),
    });
  }

  private handleError(err: Error | HttpErrorResponse): void {
    console.error('Error loading Pokémon', err);
    this.dataSource.data = [];
    this.positionTotal = 0;
    if (this.paginator) {
      this.paginator.length = 0;
      this.paginator.pageIndex = 0;
    }
  }

  private resetPagination(): void {
    this.dataSource.data = [];
    this.positionTotal = 0;
    if (this.paginator) {
      this.paginator.length = 0;
      this.paginator.pageIndex = 0;
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadPokemons();
  }

  mapToTableRow(pokemon: Pokemon): PokemonTableRow {
    return {
      position: pokemon.id,
      name: this.capitalizeFirstLetter(pokemon.name),
      image: pokemon.sprites.front_default || '',
    };
  }

  getRow(row: PokemonTableRow): void {
    this.router.navigateByUrl(`/pokemon/${row.position}`);
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

interface PokemonTableRow {
  position: number;
  name: string;
  image: string;
}
