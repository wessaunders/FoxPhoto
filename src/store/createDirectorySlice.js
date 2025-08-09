// Preload script exposes electronAPI on the window object
const electronAPI = window.electronAPI;

export const createDirectorySlice = (set, get) => ({
    currentPath: '',
    directories: [],
    error: null,
    images: [],
    loadingState: {
        isScanning: false,
        isLoadingImage: false,
    },
    rootDirs: [],
    selectedImage: null,
    closeImage: () => set({ selectedImage: null }),
    getRootDirs: async () => {
        set({ loadingState: { isScanning: true, isLoadingImage: false } });

        const rootDirs = await electronAPI.getRootDirs();

        set({
            rootDirs: rootDirs,
            directories: rootDirs.map(d => ({ name: d, path: d })),
            images: [],
            currentPath: '',
            loadingState: { isScanning: false, isLoadingImage: false },
        });
    },
    nextImage: () => {
        const { images, selectedImage } = get();
        const currentIndex = images.findIndex(img => img.path === selectedImage);

        if (currentIndex !== -1 && currentIndex < images.length - 1) {
            set({ selectedImage: images[currentIndex + 1].path });
        }
    },
    prevImage: () => {
        const { images, selectedImage } = get();
        const currentIndex = images.findIndex(img => img.path === selectedImage);

        if (currentIndex > 0) {
            set({ selectedImage: images[currentIndex - 1].path });
        }
    },
    readDirectory: async (folderPath) => {
        set({ 
            loadingState: { 
                isScanning: true, 
                isLoadingImage: false }, 
            error: null 
        });

        const isWindows = navigator.platform.startsWith('Win');
        let result = undefined;
        if (isWindows && (folderPath === '/' || folderPath === '')) {
            const rootDirs = get().rootDirs;

            result = {
                directories: rootDirs.map(d => ({ name: d, path: d })),
                images: [],
                error: null
            }
        } else {
            result = await electronAPI.readDirectory(folderPath);
        }

        if (result.error) {
            set({ 
                error: result.error, 
                directories: [], 
                images: [] 
            });
        } else {
            const { searchTerm, advancedSearch } = get();
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            let filteredImages = searchTerm
                ? result.images.filter(img => img.name.toLowerCase().includes(lowerCaseSearchTerm))
                : result.images;

            // Filter by image type
            if (advancedSearch.imageType !== 'all') {
                filteredImages = filteredImages.filter(img =>
                    img.name.toLowerCase().endsWith(`.${advancedSearch.imageType}`)
                );
            }

            // Filter by resolution (requires reading image metadata)
            if (advancedSearch.minResolution) {
                // This requires async metadata reading, so you may need to refactor for async filtering
                // For now, assume img.width and img.height are available
                filteredImages = filteredImages.filter(img =>
                    img.width >= (advancedSearch.minResolution.width 
                        ? advancedSearch.minResolution.width
                        : img.width)
                    && img.height >= (advancedSearch.minResolution.height
                        ? advancedSearch.minResolution.height
                        : img.height)
                );
            }

            // Sort images
            switch (advancedSearch.sortBy) {
                case 'name':
                    filteredImages = filteredImages.sort((a, b) =>
                        advancedSearch.sortOrder === 'asc'
                            ? a.name.localeCompare(b.name)
                            : b.name.localeCompare(a.name)
                    );
                case 'date':
                    filteredImages = filteredImages.sort((a, b) =>
                        advancedSearch.sortOrder === 'asc'
                            ? new Date(a.mtime) - new Date(b.mtime)
                            : new Date(b.mtime) - new Date(a.mtime)
                    );
                case 'resolution':
                    filteredImages = filteredImages.sort((a, b) =>
                        advancedSearch.sortOrder === 'asc'
                            ? (a.width * a.height) - (b.width * b.height)
                            : (b.width * b.height) - (a.width * a.height)
                    );
                default:
                    break;
            }

            const filteredDirectories = searchTerm
                ? result.directories.filter(dir => dir.name.toLowerCase().includes(lowerCaseSearchTerm))
                : result.directories;

            set({
                currentPath: folderPath,
                directories: filteredDirectories,
                images: filteredImages,
                error: null,
            });
        }
        set({ 
            loadingState: { 
                isScanning: false, 
                isLoadingImage: false 
            } 
        });
    },
    selectImage: (imagePath) => set({ selectedImage: imagePath }),
});