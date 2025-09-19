export { };

declare global {
    interface Window {
        electronAPI: {
            generatePdfThumbnail: (filePath: string) => Promise<string | null>;
            getExifData: (imagePath: string) => Promise<any>;
            getPdfPageCount: (filePath: string) => Promise<number>;
            getRootDirs: () => Promise<string[]>;
            loadSettings: () => Promise<{ startingPath: string | null; slideshowDelay: number; slideshowEffect: string }>;
            readFileAsArrayBuffer: (filePath: string) => Promise<ArrayBuffer>;
            readImage: (imagePath: string) => Promise<string | null>;
            readDirectory: (folderPath: string) => Promise<{
                directories: { name: string; path: string }[];
                images: { name: string; path: string; width?: number; height?: number; mtime?: string }[];
                pdfs: { name: string; path: string }[];
                error?: string | null;
            }>;
            renderPdfPage: (filePath: string, pageNumber: number, scale: number) => Promise<string | null>;
            saveSettings: (settings: { startingPath: string | null; slideshowDelay: number; slideshowEffect: string }) => Promise<void>;
            updateExifData: (imagePath: string, exifData: any) => Promise<void>;
        };
    }
}