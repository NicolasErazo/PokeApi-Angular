import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/core/services/pokemon.service';

@Component({
  selector: 'app-poke-table',
  templateUrl: './poke-table.component.html',
  styleUrls: ['./poke-table.component.scss']
})
export class PokeTableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'image', 'name'];
  dataSource = new MatTableDataSource<any>([]);
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
    const pokemons: any[] = [];

    for (let i = 1; i <= 151; i++) { // Carga solo los primeros 151 por ahora (Kanto)
      this.pokeService.getPokemons(i).subscribe({
        next: (res) => {
          const pokemonData = {
            position: i,
            image: res.sprites?.other?.home?.front_default || '',
            name: res.name
          };
          pokemons.push(pokemonData);

          // Ordenar por posición para evitar desorden en la tabla
          pokemons.sort((a, b) => a.position - b.position);

          // Actualizar datasource
          this.dataSource.data = pokemons;
          this.positionTotal = pokemons.length;

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          // Mantener orden por defecto (ascendente por posición)
          const sortState: Sort = { active: 'position', direction: 'asc' };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        },
        error: (err) => {
          console.error('Error fetching Pokémon:', err);
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

  getRow(row: any): void {
    this.router.navigateByUrl(`/pokemon/${row.position}`);
  }
}