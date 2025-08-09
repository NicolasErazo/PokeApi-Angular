export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}
