import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  Pokemon,
  PokemonApiDetailResponse,
  PokemonListResponse,
  PokemonListWithDetailsResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  private http = inject(HttpClient);

  getTotalPokemons(): Observable<number> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}?limit=1`).pipe(
      map((response) => response.count),
      catchError(() => of(0)) // Si falla, devolvemos 0
    );
  }

  getPokemons(limit: number, offset: number) {
    return this.http
      .get<PokemonListResponse>(
        `${this.baseUrl}?limit=${limit}&offset=${offset}`
      )
      .pipe(
        switchMap((response) => {
          const requests = response.results.map((item) =>
            this.http.get<PokemonApiDetailResponse>(item.url).pipe(
              map((details) => ({
                id: details.id,
                name: details.name,
                imageUrl:
                  details.sprites.other?.['official-artwork']?.front_default ||
                  '',
                types: details.types,
              }))
            )
          );

          return forkJoin(requests).pipe(
            map(
              (pokemons): PokemonListWithDetailsResponse => ({
                count: response.count,
                results: pokemons,
              })
            )
          );
        })
      );
  }

  // Buscar un pokemon por nombre o id
  searchPokemon(term: string): Observable<Pokemon | null> {
    if (!term.trim()) {
      return of(null);
    }
    return this.http.get<Pokemon>(`${this.baseUrl}/${term.toLowerCase()}`).pipe(
      catchError(() => of(null)) // Retorna null si no encuentra
    );
  }

  getPokemonById(id: number): Observable<PokemonApiDetailResponse | null> {
    return this.http
      .get<PokemonApiDetailResponse>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(() => of(null)) // Retorna null si no encuentra
      );
  }

  getPokemonByName(name: string): Observable<Pokemon | null> {
    return this.http.get<Pokemon>(`${this.baseUrl}/${name.toLowerCase()}`).pipe(
      catchError(() => of(null)) // Retorna null si no encuentra
    );
  }

  getPokemonPage(limit: number, offset: number) {
    return this.http.get<PokemonListResponse>(
      `${this.baseUrl}?limit=${limit}&offset=${offset}`
    );
  }

  getPokemonByUrl(url: string): Observable<Pokemon | null> {
    return this.http.get<Pokemon>(url).pipe(
      catchError(() => of(null)) // Retorna null si no encuentra
    );
  }

  getPokemonsByNames(names: string[]): Observable<Pokemon[]> {
    const requests = names.map((name) =>
      this.getPokemonByName(name).pipe(catchError(() => of(null)))
    );
    return forkJoin(requests).pipe(
      map((pokemons) => pokemons.filter((p) => p !== null) as Pokemon[])
    );
  }
}
