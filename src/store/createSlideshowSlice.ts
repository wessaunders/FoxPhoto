export interface SlideshowSlice {
    isSlideshowActive: boolean;
    isSlideshowPaused: boolean,
    slideshowImages: string[];
    slideshowIndex: number;
    selectedImagesForSlideshow: string[];
    nextSlide: () => void;
    pauseSlideshow: () => void;
    playSlideshow: () => void;
    previousSlide: () => void;
    startSlideshow: () => void;
    stopSlideshow: () => void;
    toggleImageForSlideshow: (imagePath: string) => void;
}

export const createSlideshowSlice = (set, get): SlideshowSlice => ({
    isSlideshowActive: false,
    isSlideshowPaused: false,
    slideshowImages: [],
    slideshowIndex: 0,
    selectedImagesForSlideshow: [],
    nextSlide: () => {
        set(state => ({
            slideshowIndex: (state.slideshowIndex + 1) % state.slideshowImages.length,
        }));
    },
    pauseSlideshow: () => {
        set({
            isSlideshowPaused: false
        });
    }, 
    playSlideshow: () => {
        set({
            isSlideshowPaused: true
        });
    },
    previousSlide: () => {
        set(state => ({
            slideshowIndex: (state.slideshowIndex - 1 + state.slideshowImages.length) % state.slideshowImages.length,
        }));
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
    toggleImageForSlideshow: (imagePath: string) => {
        set(state => {
            const isSelected = state.selectedImagesForSlideshow.includes(imagePath);
            const selectedImages = isSelected
                ? state.selectedImagesForSlideshow.filter(path => path !== imagePath)
                : [...state.selectedImagesForSlideshow, imagePath];
            return { selectedImagesForSlideshow: selectedImages };
        });
    },
});