import { NamedAPIResource } from "src/app/core/services/interfaces/api-response.interface";

export interface Pokemon {
    url(url: any): unknown;
    id: number;
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    is_default: boolean;
    order: number;
    sprites: PokemonSprites;
    abilities: PokemonAbility[];
    forms: NamedAPIResource[];
    game_indices: PokemonGameIndex[];
    held_items: PokemonHeldItem[];
    location_area_encounters: string;
    moves: PokemonMove[];
    species: NamedAPIResource;
    stats: PokemonStat[];
    types: PokemonType[];
    past_types: PokemonTypePast[];
}

export interface PokemonSprites {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: PokemonSpritesOther;
    versions: PokemonSpritesVersions;
}

export interface PokemonSpritesOther {
    dream_world: {
        front_default: string | null;
        front_female: string | null;
    };
    home: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
    };
    'official-artwork': {
        front_default: string | null;
        front_shiny: string | null;
    };
}

export interface PokemonSpritesVersions {
    'generation-i': {
        'red-blue': PokemonSpritesVersionDetail;
        yellow: PokemonSpritesVersionDetail;
    };
    'generation-ii': {
        crystal: PokemonSpritesVersionDetail;
        gold: PokemonSpritesVersionDetail;
        silver: PokemonSpritesVersionDetail;
    };
    'generation-iii': {
        emerald: PokemonSpritesVersionDetail;
        'firered-leafgreen': PokemonSpritesVersionDetail;
        'ruby-sapphire': PokemonSpritesVersionDetail;
    };
    'generation-iv': {
        'diamond-pearl': PokemonSpritesVersionDetail;
        'heartgold-soulsilver': PokemonSpritesVersionDetail;
        platinum: PokemonSpritesVersionDetail;
    };
    'generation-v': {
        'black-white': PokemonSpritesVersionDetail;
    };
    'generation-vi': {
        'omegaruby-alphasapphire': PokemonSpritesVersionDetail;
        'x-y': PokemonSpritesVersionDetail;
    };
    'generation-vii': {
        icons: PokemonSpritesVersionDetail;
        'ultra-sun-ultra-moon': PokemonSpritesVersionDetail;
    };
    'generation-viii': {
        icons: PokemonSpritesVersionDetail;
    };
}

export interface PokemonSpritesVersionDetail {
    back_default: string | null;
    back_female: string | null;
    back_gray: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    back_transparent: string | null;
    front_default: string | null;
    front_female: string | null;
    front_gray: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    front_transparent: string | null;
}

export interface PokemonAbility {
    ability: NamedAPIResource;
    is_hidden: boolean;
    slot: number;
}

export interface PokemonGameIndex {
    game_index: number;
    version: NamedAPIResource;
}

export interface PokemonHeldItem {
    item: NamedAPIResource;
    version_details: PokemonHeldItemVersion[];
}

export interface PokemonHeldItemVersion {
    rarity: number;
    version: NamedAPIResource;
}

export interface PokemonMove {
    move: NamedAPIResource;
    version_group_details: PokemonMoveVersion[];
}

export interface PokemonMoveVersion {
    level_learned_at: number;
    move_learn_method: NamedAPIResource;
    version_group: NamedAPIResource;
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: NamedAPIResource;
}

export interface PokemonType {
    slot: number;
    type: NamedAPIResource;
}

export interface PokemonTypePast {
    generation: NamedAPIResource;
    types: PokemonType[];
}