// src/app/features/pokemon/services/pokemon.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { PokemonDetail, PokemonListResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly POKEMON_ENDPOINT = 'pokemon';
  private apiService = inject(ApiService);

  getPokemons(limit = 20, offset = 0): Observable<PokemonListResponse> {
    return this.apiService.get<PokemonListResponse>(this.POKEMON_ENDPOINT, {
      limit,
      offset,
    });
  }

  getPokemonById(id: number): Observable<PokemonDetail> {
    return this.apiService.get<PokemonDetail>(`${this.POKEMON_ENDPOINT}/${id}`);
  }
}
