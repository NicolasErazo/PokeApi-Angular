export interface APIResource {
    url: string;
}

export interface NamedAPIResource {
    name: string;
    url: string;
}

export interface Name {
    name: string;
    language: NamedAPIResource;
}

export interface Description {
    description: string;
    language: NamedAPIResource;
}

export interface Effect {
    effect: string;
    language: NamedAPIResource;
}

export interface FlavorText {
    flavor_text: string;
    language: NamedAPIResource;
    version: NamedAPIResource;
}

export interface VerboseEffect {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
}

export interface VersionEncounterDetail {
    version: NamedAPIResource;
    max_chance: number;
    encounter_details: Encounter[];
}

export interface Encounter {
    min_level: number;
    max_level: number;
    condition_values: NamedAPIResource[];
    chance: number;
    method: NamedAPIResource;
}

// Respuestas paginadas de la API
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

