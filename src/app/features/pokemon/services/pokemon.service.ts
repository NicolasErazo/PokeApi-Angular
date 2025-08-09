import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from 'src/app/features/pokemon/interfaces';

import { NamedAPIResource } from '../../../core/services/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  url = 'https://pokeapi.co/api/v2/pokemon';

  private http = inject(HttpClient);

  getPokemons(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.url}/${id}`);
  }

  getPokemonPage(
    limit: number,
    offset: number
  ): Observable<{ count: number; results: NamedAPIResource[] }> {
    return this.http.get<{ count: number; results: NamedAPIResource[] }>(
      `${this.url}?limit=${limit}&offset=${offset}` // ✅ Arreglado aquí
    );
  }

  getPokemonByUrl(url: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(url);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.url}/${id}`);
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.url}/${name}`);
  }
}
