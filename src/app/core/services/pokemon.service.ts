import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from 'src/app/features/pokemon/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  url: string = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemons(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.url}/${id}`);
  }

  getPokemonPage(limit: number = 20, offset: number = 0) {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonByUrl(url: string) {
    return this.http.get<any>(url);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`);
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }

}
