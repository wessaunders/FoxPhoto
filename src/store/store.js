import { create } from 'zustand';

// Preload script exposes electronAPI on the window object
const electronAPI = window.electronAPI;

const useFoxPhotoStore = create((set, get) => ({
    currentPath: '',
    directories: [],
    error: null,
    images: [],
    isSlideshowActive: false,
    loadingState: {
        isScanning: false,
        isLoadingImage: false,
    },
    rootDirs: [],
    selectedImage: null,
    selectedImagesForSlideshow: [],
    slideshowDelay: 3000, // Default 3 second delay
    slideshowEffect: 'fade', // Default fade effect
    slideshowImages: [],
    slideshowIndex: 0,
    startingPath: null,

    // Actions
    closeImage: () => {
        set({ selectedImage: null });
    },

    getRootDirs: async () => {
        set({ 
            loadingState: { 
                isScanning: true, 
                isLoadingImage: false 
            } 
        });

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

    nextSlide: () => {
        set(state => ({
            slideshowIndex: (state.slideshowIndex + 1) % state.slideshowImages.length,
        }));
    },

    prevImage: () => {
        const { images, selectedImage } = get();
        const currentIndex = images.findIndex(img => img.path === selectedImage);
        if (currentIndex > 0) {
            set({ selectedImage: images[currentIndex - 1].path });
        }
    },

    previousSlide: () => {
        set(state => ({
            slideshowIndex: (state.slideshowIndex - 1 + state.slideshowImages.length) % state.slideshowImages.length,
        }));
    },

    readDirectory: async (folderPath) => {
        set({ 
            loadingState: { 
                isScanning: true, 
                isLoadingImage: false 
            }, 
            error: null 
        });

        const result = await electronAPI.readDirectory(folderPath);
        if (result.error) {
            set({ 
                error: result.error, 
                directories: [], 
                images: [] 
            });
        } else {
            set({
                currentPath: folderPath,
                directories: result.directories,
                images: result.images,
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

    selectImage: (imagePath) => {
        set({ selectedImage: imagePath });
    }, 

    setSlideshowDelay: (delay) => {
        set({ slideshowDelay: delay });
    },

    setSlideshowEffect: (effect) => {
        set({ slideshowEffect: effect });
    },

    setStartingPath: (path) => {
        set({ startingPath: path });
    },

    startSlideshow: () => {
        const { images, selectedImagesForSlideshow } = get();
        const slideshowImages = selectedImagesForSlideshow.length > 0
            ? selectedImagesForSlideshow
            : images.map(img => img.path);

        if (slideshowImages.length > 0) {
            set({
                isSlideshowActive: true,
                slideshowImages: slideshowImages,
                slideshowIndex: 0
            });
        }
    },

    stopSlideshow: () => {
        set({
            isSlideshowActive: false,
            slideshowImages: [],
            slideshowIndex: 0
        });
    },

    toggleImageForSlideshow: (imagePath) => {
        set(state => {
            const isSelected = state.selectedImagesForSlideshow.includes(imagePath);
            const selectedImages = isSelected
                ? state.selectedImagesForSlideshow.filter(path => path !== imagePath)
                : [...state.selectedImagesForSlideshow, imagePath];

            return { selectedImagesForSlideshow: selectedImages };
        });
    }
}));

export default useFoxPhotoStore;
