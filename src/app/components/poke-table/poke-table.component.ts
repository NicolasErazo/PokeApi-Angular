import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-poke-table',
  templateUrl: './poke-table.component.html',
  styleUrls: ['./poke-table.component.scss']
})
export class PokeTableComponent implements OnInit {

  displayedColumns: string[] = ['position','image','name'];
  data: any[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  pokemons = [];
  positionTotal = 0;

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pokeService: PokemonService, private router: Router){}

  ngOnInit(): void {
    return this.getPokemons();
  }

  getPokemons(){
    let pokemonData;
    for(let i = 1; i <= 891; i++){
      this.pokeService.getPokemons(i).subscribe(
        res => {
          pokemonData = {
            position: i,
            image: res.sprites.other.home.front_default,
            name: res.name
          };
          this.data.push(pokemonData);
          this.positionTotal = i;
          this.dataSource = new MatTableDataSource<any>(this.data)
          this.dataSource.paginator = this.paginator;
          //ORDEN ASCENDENTE
          this.dataSource.sort = this.sort;
          const sortState: Sort = {active: 'position', direction: 'asc'};
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
      },
      err=>{
        console.log(err);
      }
      )}
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    getRow(row: any){
      this.router.navigateByUrl(`/pokeDetail/${row.position}`)
    }
    
}
