import { Directory, ImageType, FileTypes, LoadingState, PdfType } from '../interfaces/ui';

interface SelectedImage {
    name: string | null,
    path: string | null,
    rotation: number, 
    type: FileTypes
};

export interface DirectorySlice {
    currentPath: string;
    directories: Directory[];
    error: string | null;
    images: ImageType[];
    loadingState: LoadingState;
    pdfs: PdfType[],
    rootDirs: string[];
    selectedImage: SelectedImage,
    showFullSizeImage: boolean,
    closeImage: () => void;
    getRootDirs: () => Promise<void>;
    navigateToParent: () => Promise<void>;
    nextImage: () => void;
    prevImage: () => void;
    readDirectory: (folderPath: string) => Promise<void>;
    refreshDirectory: () => Promise<void>;
    rotateLeft: () => void;
    rotateRight: () => void;
    selectImage: (imagePath: string) => void;
    setShowFullSizeImage: () => void;
};

export const createDirectorySlice = (set, get): DirectorySlice => ({
    currentPath: '',
    directories: [],
    error: null,
    images: [],
    loadingState: {
        isScanning: false,
        isLoadingImage: false,
    },
    pdfs: [],
    rootDirs: [],
    selectedImage: {
        name: null,
        path: null,
        rotation: 0,
        type: FileTypes.ImageType
    },
    showFullSizeImage: false,
    closeImage: () => set({ 
        showFullSizeImage: false 
    }),
    getRootDirs: async () => {
        set({ loadingState: { isScanning: true, isLoadingImage: false } });

        const rootDirs = await window.electronAPI.getRootDirs();

        set({
            rootDirs: rootDirs,
            directories: rootDirs.map(d => ({ name: d, path: d })),
            images: [],
            currentPath: '',
            loadingState: { isScanning: false, isLoadingImage: false },
        });
    },
    navigateToParent: async () => {
        if (get().currentPath !== '/') {
            const parentPath = get().currentPath.substring(0, get().currentPath.lastIndexOf('/'));
            get().readDirectory(parentPath || '/');
        }
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
        let result: any = undefined;
        if (isWindows && (folderPath === '/' || folderPath === '')) {
            const rootDirs = get().rootDirs;

            result = {
                directories: rootDirs.map(d => ({ name: d, path: d })),
                images: [],
                pdfs: [],
                error: null
            }
        } else {
            result = await window.electronAPI.readDirectory(folderPath);
        }

        if (result.error) {
            set({ 
                error: result.error, 
                directories: [], 
                images: [], 
                pdfs: [] 
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
                            ? new Date(a.mtime).getTime() - new Date(b.mtime).getTime()
                            : new Date(b.mtime).getTime() - new Date(a.mtime).getTime()
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
                error: null,
                images: filteredImages,
                pdfs: result.pdfs,
                selectedImage: null,
                showFullSizeImage: false
            });
        }
        set({ 
            loadingState: { 
                isScanning: false, 
                isLoadingImage: false 
            } 
        });
    },
    refreshDirectory: async () => {
        get().readDirectory(get().currentPath);
    },
    rotateLeft: () => {
        const currentRotation = get().selectedImage.rotation;

        set({ selectedImage: {
                ...get().selectedImage,
                rotation: currentRotation - 90
            }
        });
    }, 
    rotateRight: () => {
        const currentRotation = get().selectedImage.rotation;

        set({
            selectedImage: {
                ...get().selectedImage,
                rotation: currentRotation + 90
            }
        });
    },
    selectImage: (imagePath) => {
        const ext = imagePath.substring(imagePath.lastIndexOf('.')).toLowerCase();

        let fileType: FileTypes = FileTypes.ImageType;
        if (ext === '.pdf') {
            fileType = FileTypes.PdfType;
        }

        set({ 
            selectedImage: {
                name: imagePath.split('/').pop() || imagePath,
                path: imagePath, 
                rotation: 0,
                type: fileType 
            }
        });
    },
    setShowFullSizeImage: () => {
        set({
            showFullSizeImage: !get().showFullSizeImage
        })
    }
});