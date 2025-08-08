export const createSearchSlice = (set, get) => ({
    advancedSearch: {
        imageType: 'all',
        sortBy: 'name',
        sortOrder: 'asc',
        minResolution: null,
    },
    searchTerm: '',
    clearSearchTerm: () => {
        set({ searchTerm: '' });
        get().readDirectory(get().currentPath);
    },
    setAdvancedSearch: (criteria) => {
        set({
            advancedSearch: {
                ...get().advancedSearch,
                ...criteria
            }
        });
    },
    setSearchTerm: (term) => {
        set({ searchTerm: term });
        get().readDirectory(get().currentPath);
    },
});