import { Pokemon } from './pokemon.model';

export interface PokemonDetail extends Pokemon {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  abilities: string[];
  height: number;
  weight: number;
}
