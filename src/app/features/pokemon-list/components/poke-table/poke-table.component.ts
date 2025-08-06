import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { Pokemon } from 'src/app/features/pokemon/interfaces';

interface PokeRow {
  position: number;
  image: string;
  name: string;
}

@Component({
  selector: 'app-poke-table',
  templateUrl: './poke-table.component.html',
  styleUrls: ['./poke-table.component.scss']
})
export class PokeTableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'image', 'name'];
  dataSource = new MatTableDataSource<PokeRow>([]);
  positionTotal = 0;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private pokeService: PokemonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    const pokemons: PokeRow[] = [];

    for (let i = 1; i <= 151; i++) {
      this.pokeService.getPokemon(i).subscribe({
        next: (res: Pokemon) => {
          const pokemonData: PokeRow = {
            position: i,
            image: res.sprites?.other?.home?.front_default || '',
            name: res.name
          };

          pokemons.push(pokemonData);

          // Actualizar tabla solo cuando el array está completo
          if (pokemons.length === 151) {
            pokemons.sort((a, b) => a.position - b.position);
            this.dataSource.data = pokemons;
            this.positionTotal = pokemons.length;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            const sortState: Sort = { active: 'position', direction: 'asc' };
            this.sort.active = sortState.active;
            this.sort.direction = sortState.direction;
            this.sort.sortChange.emit(sortState);
          }
        },
        error: (err) => {
          console.error(`Error fetching Pokémon ID ${i}:`, err);
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRow(row: PokeRow): void {
    this.router.navigateByUrl(`/pokemon/${row.position}`);
  }
}