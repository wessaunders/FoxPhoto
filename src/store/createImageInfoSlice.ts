import { ImageType } from '../interfaces/ui';

export interface ExifData {
    [key: string]: any;
    // Common EXIF fields
    Make?: string;
    Model?: string;
    DateTime?: string;
    DateTimeOriginal?: string;
    ExifImageWidth?: number;
    ExifImageHeight?: number;
    Orientation?: number;
    Software?: string;
    Artist?: string;
    Copyright?: string;
    ImageDescription?: string;
    XResolution?: number;
    YResolution?: number;
    ResolutionUnit?: number;
    FNumber?: number;
    ExposureTime?: number;
    ISO?: number;
    FocalLength?: number;
    Flash?: number;
    WhiteBalance?: number;
    GPS?: {
        GPSLatitude?: number;
        GPSLongitude?: number;
        GPSAltitude?: number;
    };
}

export interface ImageInfoSlice {
    isImageInfoOpen: boolean;
    selectedImageInfo: ImageType | null;
    exifData: ExifData | null;
    isEditing: boolean;
    editingField: string | null;
    pendingChanges: Partial<ExifData>;
    openImageInfo: (image: ImageType) => void;
    closeImageInfo: () => void;
    toggleImageInfo: () => void;
    setExifData: (exifData: ExifData) => void;
    startEditing: (field: string) => void;
    stopEditing: () => void;
    updateField: (field: string, value: any) => void;
    saveChanges: () => Promise<void>;
    discardChanges: () => void;
    refreshExifData: () => Promise<void>;
}

export const createImageInfoSlice = (set, get): ImageInfoSlice => ({
    isImageInfoOpen: false,
    selectedImageInfo: null,
    exifData: null,
    isEditing: false,
    editingField: null,
    pendingChanges: {},

    openImageInfo: (image: ImageType) => {
        set({
            isImageInfoOpen: true,
            selectedImageInfo: image,
            exifData: image || null,
            pendingChanges: {}
        });
    },

    closeImageInfo: () => {
        set({
            isImageInfoOpen: false,
            selectedImageInfo: null,
            exifData: null,
            isEditing: false,
            editingField: null,
            pendingChanges: {}
        });
    },

    toggleImageInfo: () => {
        const { isImageInfoOpen } = get();
        if (isImageInfoOpen) {
            get().closeImageInfo();
        } else {
            const { selectedImage, images } = get();
            if (selectedImage?.path) {
                const image = images.find(img => img.path === selectedImage.path);
                if (image) {
                    get().openImageInfo(image);
                }
            }
        }
    },

    setExifData: (exifData: ExifData) => {
        set({ exifData });
    },

    startEditing: (field: string) => {
        set({
            isEditing: true,
            editingField: field
        });
    },

    stopEditing: () => {
        set({
            isEditing: false,
            editingField: null
        });
    },

    updateField: (field: string, value: any) => {
        const { pendingChanges } = get();
        set({
            pendingChanges: {
                ...pendingChanges,
                [field]: value
            }
        });
    },

    saveChanges: async () => {
        const { selectedImageInfo, pendingChanges } = get();
        if (!selectedImageInfo || Object.keys(pendingChanges).length === 0) {
            return;
        }

        try {
            // Call the Electron API to save EXIF changes
            await window.electronAPI.updateExifData(selectedImageInfo.path, pendingChanges);

            // Update the local EXIF data
            const { exifData } = get();
            set({
                exifData: { ...exifData, ...pendingChanges },
                pendingChanges: {},
                isEditing: false,
                editingField: null
            });

            // Refresh the directory to get updated image data
            get().refreshDirectory();
        } catch (error) {
            console.error('Failed to save EXIF changes:', error);
            // You could add error handling UI here
        }
    },

    discardChanges: () => {
        set({
            pendingChanges: {},
            isEditing: false,
            editingField: null
        });
    },

    refreshExifData: async () => {
        const { selectedImageInfo } = get();
        if (!selectedImageInfo) return;

        try {
            const updatedExifData = await window.electronAPI.getExifData(selectedImageInfo.path);
            set({ exifData: updatedExifData });
        } catch (error) {
            console.error('Failed to refresh EXIF data:', error);
        }
    }
});