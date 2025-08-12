export { };

declare global {
    interface Window {
        electronAPI: {
            getRootDirs: () => Promise<string[]>;
            loadSettings: () => Promise<{ startingPath: string | null; slideshowDelay: number; slideshowEffect: string }>;
            readFileAsArrayBuffer: (filePath: string) => Promise<ArrayBuffer>;
            readImage: (imagePath: string) => Promise<string | null>;            
            readDirectory: (folderPath: string) => Promise<{
                directories: { name: string; path: string }[];
                images: { name: string; path: string; width?: number; height?: number; mtime?: string }[];
                error?: string | null;
            }>;
            saveSettings: (settings: { startingPath: string | null; slideshowDelay: number; slideshowEffect: string }) => Promise<void>;
        };
    }
}