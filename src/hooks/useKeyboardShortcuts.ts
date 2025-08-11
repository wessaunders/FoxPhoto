import { useHotkeys } from '@mantine/hooks';
import useFoxPhotoStore from '../store/store';

interface KeyboardShortcuts {
    toggleColorScheme: () => void
}


const useKeyboardShortcuts = (props: Partial<KeyboardShortcuts>) => {
    const { toggleColorScheme } = props;

    const {
        // Directory slice
        navigateToParent,
        refreshDirectory,

        // Search slice
        clearSearchTerm,
        toggleAdvancedSearch,

        // Slideshow slice
        isSlideshowActive,
        isSlideshowPaused,
        pauseSlideshow,
        playSlideshow,
        startSlideshow,
        stopSlideshow,
        nextSlide,
        previousSlide,

        // Image navigation
        nextImage,
        prevImage,
        images,
        selectImage,
        selectedImage,
        setShowFullSizeImage,
        showFullSizeImage
    } = useFoxPhotoStore();

    // Navigation shortcuts
    useHotkeys([
        ['ArrowLeft', () => {
            if (isSlideshowActive) {
                previousSlide();
            } else if (showFullSizeImage) {
                prevImage();
            }
        }],
        ['ArrowRight', () => {
            if (isSlideshowActive) {
                nextSlide();
            } else if (showFullSizeImage) {
                nextImage();
            }
        }],
        ['ArrowUp', () => {
            if (!showFullSizeImage && !isSlideshowActive) {
                navigateToParent();
            }
        }],
    ]);

    // Image viewing shortcuts
    useHotkeys([
        ['Space', (event) => {
            event.preventDefault();
            if (isSlideshowActive) {
                if (isSlideshowPaused) {
                    playSlideshow();
                } else {
                    pauseSlideshow();
                }
            } else if (selectedImage !== null) {
                setShowFullSizeImage();
            }
        }],
        ['Enter', () => {
            if (selectedImage !== null && !showFullSizeImage) {
                setShowFullSizeImage();
            }
        }],
        ['Escape', () => {
            if (showFullSizeImage) {
                setShowFullSizeImage();
            } else if (isSlideshowActive) {
                stopSlideshow();
            }
        }],
        ['f', () => {
            if (selectedImage !== null) {
                setShowFullSizeImage();
            }
        }],
    ]);

    // Slideshow shortcuts
    useHotkeys([
        ['s', () => {
            if (images.length > 0) {
                if (isSlideshowActive) {
                    stopSlideshow();
                } else {
                    startSlideshow();
                }
            }
        }],
        ['p', () => {
            if (isSlideshowActive) {
                if (!isSlideshowPaused) {
                    pauseSlideshow();
                } else {
                    playSlideshow();
                }
            }
        }],
    ]);

    // Search shortcuts
    useHotkeys([
        ['mod+f', (event) => {
            event.preventDefault();
            toggleAdvancedSearch();
        }],
        ['mod+shift+f', (event) => {
            event.preventDefault();
            clearSearchTerm();
        }],
    ]);

    // Application shortcuts
    useHotkeys([
        ['F5', (event) => {
            event.preventDefault();
            refreshDirectory();
        }],
        ['mod+r', (event) => {
            event.preventDefault();
            refreshDirectory();
        }],
        ['mod+d', () => {
            if (toggleColorScheme) {
                toggleColorScheme();
            }
        }],
    ]);

    // Thumbnail grid navigation
    useHotkeys([
        ['Home', () => {
            if (!showFullSizeImage && images.length > 0) {
                selectImage(images[0].path);
            }
        }],
        ['End', () => {
            if (!showFullSizeImage && images.length > 0) {
                selectImage(images[images.length - 1].path);
            }
        }],
    ]);
};

export default useKeyboardShortcuts;
