export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export interface PaginationConfig {
    page: number;
    limit: number;
    total: number;
}

export interface FilterOptions {
    search?: string;
    types?: string[];
    generation?: string;
    sortBy?: 'id' | 'name' | 'height' | 'weight';
    sortOrder?: 'asc' | 'desc';
}

export interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiry: number;
}