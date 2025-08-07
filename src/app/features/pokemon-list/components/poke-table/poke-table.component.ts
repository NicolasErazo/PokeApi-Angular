import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { forkJoin, debounceTime, Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Pokemon } from 'src/app/features/pokemon/interfaces';
import { NamedAPIResource } from 'src/app/core/services/interfaces/api-response.interface';

@Component({
    selector: 'app-poke-table',
    templateUrl: './poke-table.component.html',
    styleUrls: ['./poke-table.component.scss']
})
export class PokeTableComponent implements OnInit {
    displayedColumns: string[] = ['position', 'image', 'name'];
    dataSource = new MatTableDataSource<PokemonTableRow>([]);

    positionTotal = 0;
    pageSize = 5;
    currentPage = 0;

    pokemonCtrl = new FormControl();
    allPokemonNames: string[] = [];
    filteredPokemonNames: string[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    pokeService = inject(PokemonService);
    router = inject(Router);

    ngOnInit(): void {
        this.loadPokemons();
        this.loadAllPokemonNames();

        this.pokemonCtrl.valueChanges.pipe(
            debounceTime(300)
        ).subscribe(value => {
            const val = (value || '').toString().trim().toLowerCase();

            if (!val) {
                this.loadPokemons();
                return;
            }

            const id = parseInt(val, 10);
            if (!isNaN(id)) {
                this.pokeService.getPokemonById(id).subscribe(pokemon => {
                    this.dataSource.data = [this.mapToTableRow(pokemon)];
                }, () => this.dataSource.data = []);
            } else {
                const filtered = this.allPokemonNames.filter(name =>
                    name.includes(val)
                );
                this.filteredPokemonNames = filtered;

                if (this.allPokemonNames.includes(val)) {
                    this.pokeService.getPokemonByName(val).subscribe(pokemon => {
                        this.dataSource.data = [this.mapToTableRow(pokemon)];
                    }, () => this.dataSource.data = []);
                }
            }
        });
    }

    onOptionSelected(event: MatAutocompleteSelectedEvent): void {
        const name = event.option.value;
        this.pokeService.getPokemonByName(name).subscribe(pokemon => {
            this.dataSource.data = [this.mapToTableRow(pokemon)];
        }, () => this.dataSource.data = []);
    }

    loadAllPokemonNames(): void {
        this.pokeService.getPokemonPage(1000, 0).subscribe({
            next: (response: { count: number; results: NamedAPIResource[] }) => {
                this.allPokemonNames = response.results.map((p: NamedAPIResource) => p.name);
            },
            error: (err) => console.error('Error loading names', err)
        });
    }

    loadPokemons(): void {
        const offset = this.currentPage * this.pageSize;

        this.pokeService.getPokemonPage(this.pageSize, offset).subscribe({
            next: (response: { count: number; results: NamedAPIResource[] }) => {
                const requests: Observable<Pokemon>[] = response.results.map((pokemon: NamedAPIResource) =>
                    this.pokeService.getPokemonByUrl(pokemon.url)
                );

                forkJoin(requests).subscribe({
                    next: (results: Pokemon[]) => {
                        const pokemons = results.map((res: Pokemon) => this.mapToTableRow(res));
                        this.dataSource.data = pokemons;
                        this.positionTotal = response.count;
                    },
                    error: (err) => console.error('Error joining Pokémon requests', err)
                });
            },
            error: (err) => console.error('Error loading Pokémon page', err)
        });
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
            image: pokemon.sprites.front_default || ''
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