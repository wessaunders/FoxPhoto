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

export interface ImageType {
    name: string;
    path: string;
    width?: number;
    height?: number;
    mtime?: string;
    [key: string]: any;
}

export interface LoadingState {
    isScanning: boolean;
    isLoadingImage: boolean;
}
