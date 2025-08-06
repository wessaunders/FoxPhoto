import { create } from 'zustand';

// Preload script exposes electronAPI on the window object
const electronAPI = window.electronAPI;

const useFoxPhotoStore = create((set, get) => ({
    currentPath: '',
    directories: [],
    error: null,
    images: [],
    loadingState: {
        isScanning: false,
        isLoadingImage: false,
    },
    selectedImage: null,
    rootDirs: [],

    // Actions
    closeImage: () => {
        set({ selectedImage: null });
    },

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
        set({ loadingState: { isScanning: true, isLoadingImage: false }, error: null });
        const result = await electronAPI.readDirectory(folderPath);
        if (result.error) {
            set({ error: result.error, directories: [], images: [] });
        } else {
            set({
                currentPath: folderPath,
                directories: result.directories,
                images: result.images,
                error: null,
            });
        }
        set({ loadingState: { isScanning: false, isLoadingImage: false } });
    },

    selectImage: (imagePath) => {
        set({ selectedImage: imagePath });
    }
}));

export default useFoxPhotoStore;
