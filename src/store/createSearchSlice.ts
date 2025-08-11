interface AdvancedSearchOptions {
    imageType: string;
    sortBy: 'name' | 'date' | 'resolution';
    sortOrder: 'asc' | 'desc';
    minResolution?: {
        width: number;
        height: number;
    };
}

export interface SearchSlice {
    advancedSearch: AdvancedSearchOptions;
    advancedSearchOpen: boolean,
    searchTerm: string;
    clearSearchTerm: () => void;
    setAdvancedSearch: (options: Partial<AdvancedSearchOptions>) => void;
    setSearchTerm: (term: string) => void;
    toggleAdvancedSearch: () => void;
}

export const createSearchSlice = (set, get): SearchSlice => ({
    advancedSearch: {
        imageType: 'all',
        sortBy: 'name',
        sortOrder: 'asc',
        minResolution: undefined,
    },
    advancedSearchOpen: false,
    searchTerm: '',
    clearSearchTerm: () => {
        set({ searchTerm: '' });
        get().readDirectory(get().currentPath);
    },
    setAdvancedSearch: (criteria: Partial<AdvancedSearchOptions>) => {
        set({
            advancedSearch: {
                ...get().advancedSearch,
                ...criteria
            }
        });
    },
    setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().readDirectory(get().currentPath);
    },
    toggleAdvancedSearch: () => {
        set({ advancedSearchOpen: !get().advancedSearchOpen });
    }
});