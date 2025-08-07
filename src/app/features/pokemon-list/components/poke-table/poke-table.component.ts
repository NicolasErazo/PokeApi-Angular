// ✅ 1. forkJoin para cargar Pokémon eficientemente

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pokeService: PokemonService, private router: Router) { }

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(offset: number = 0, limit: number = 20): void {
    this.pokeService.getPokemonPage(limit, offset).subscribe({
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
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error: (err) => console.error('Error loading Pokémon page', err)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  getRow(row: any): void {
    this.router.navigateByUrl(`/pokemon/${row.position}`);
  }
}