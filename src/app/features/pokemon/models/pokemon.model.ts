export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: {
    type: {
      name: string;
    };
  }[];
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListWithDetailsResponse {
  count: number;
  results: Pokemon[];
}
