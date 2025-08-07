import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-poke-table',
  templateUrl: './poke-table.component.html',
  styleUrls: ['./poke-table.component.scss']
})
export class PokeTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'image', 'name'];
  dataSource = new MatTableDataSource<any>([]);
  positionTotal = 0;

  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pokeService: PokemonService, private router: Router) { }

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    const offset = this.currentPage * this.pageSize;

    this.pokeService.getPokemonPage(this.pageSize, offset).subscribe({
      next: (response) => {
        const requests = response.results.map((pokemon: any) =>
          this.pokeService.getPokemonByUrl(pokemon.url)
        );

        forkJoin<any[]>(requests).subscribe((results) => {
          const pokemons = results.map((res) => ({
            position: res.id,
            image: res.sprites?.other?.home?.front_default || '',
            name: res.name
          }));

          this.dataSource.data = pokemons;
          this.positionTotal = response.count;
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (!filterValue) return;

    // Si es un número, buscar por ID
    const id = parseInt(filterValue, 10);
    if (!isNaN(id)) {
      this.pokeService.getPokemonById(id).subscribe(pokemon => {
        this.dataSource.data = [this.mapToTableRow(pokemon)];
      }, () => {
        this.dataSource.data = [];
      });
    } else {
      // Si es texto, buscar por nombre
      this.pokeService.getPokemonByName(filterValue).subscribe(pokemon => {
        this.dataSource.data = [this.mapToTableRow(pokemon)];
      }, () => {
        this.dataSource.data = [];
      });
    }
  }

  mapToTableRow(pokemon: any) {
    return {
      position: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.front_default,
    };
  }

  getRow(row: any): void {
    this.router.navigateByUrl(`/pokemon/${row.position}`);
  }
}