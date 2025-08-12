export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface Directory {
    name: string;
    path: string;
}

export interface DirectoryType {
    name: string;
    path: string;
    [key: string]: any;
}

export enum FileTypes {
    DirectoryType = 'directory',
    ImageType = 'image',
    PdfType = 'pdf'
}

export interface ImageType {
    name: string;
    path: string;
    width?: number;
    height?: number;
    mtime?: string;
    [key: string]: any;
}

export type ItemType = (DirectoryType | ImageType | PdfType) & { type: 'directory' | 'image' | 'pdf' };

export interface LoadingState {
    isScanning: boolean;
    isLoadingImage: boolean;
}

export interface PdfType {
    name: string;
    path: string;
}