import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';

import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  searchControl = new FormControl('');
  filteredOptions!: Observable<Pokemon[]>;

  displayedColumns: string[] = ['id', 'image', 'name', 'types'];
  dataSource: Pokemon[] = [];
  pageSize = 10;
  pageIndex = 0;
  totalPokemons = 0;
  isLoading = true;

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit(): void {
    this.loadPokemons();
    this.setupAutocomplete();
  }

  private loadPokemons(): void {
    this.isLoading = true;
    const offset = this.pageIndex * this.pageSize;

    this.pokemonService.getPokemons(this.pageSize, offset).subscribe({
      next: (response) => {
        this.dataSource = response.results;
        this.totalPokemons = response.count;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading Pokémon', err);
        this.isLoading = false;
      },
    });
  }

  private setupAutocomplete(): void {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): Pokemon[] {
    const filterValue = value.toLowerCase();
    return this.dataSource.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(filterValue) ||
        pokemon.id.toString().includes(filterValue)
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadPokemons();
  }

  viewPokemonDetail(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id]);
  }
}
