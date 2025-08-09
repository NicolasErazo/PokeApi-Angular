import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { PokemonApiDetailResponse } from '../models';
import {
  Pokemon,
  PokemonApiResponse,
  PokemonListItem,
  PokemonListResponse,
} from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly apiService = inject(ApiService);
  private readonly POKEMON_ENDPOINT = 'pokemon';

  getPokemons(limit = 10, offset = 0): Observable<PokemonListResponse> {
    return this.apiService
      .get<PokemonApiResponse>(this.POKEMON_ENDPOINT, { limit, offset })
      .pipe(
        switchMap((apiResponse: PokemonApiResponse) => {
          const requests = apiResponse.results.map(
            (item: PokemonListItem, index: number) =>
              this.getPokemonDetails(offset + index + 1, item.name)
          );
          return forkJoin(requests).pipe(
            map((pokemons: Pokemon[]) => ({
              count: apiResponse.count,
              results: pokemons,
            }))
          );
        })
      );
  }

  private getPokemonDetails(id: number, name: string): Observable<Pokemon> {
    return this.apiService
      .getById<PokemonApiDetailResponse>(this.POKEMON_ENDPOINT, id)
      .pipe(
        map((details: PokemonApiDetailResponse) => ({
          id: details.id,
          name: details.name,
          imageUrl: details.sprites.front_default,
          types: details.types.map((t) => t.type.name),
        }))
      );
  }
}
