export interface PokemonApiDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    front_shiny?: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
      home?: {
        front_shiny?: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities?: {
    ability: {
      name: string;
    };
  }[];
}
