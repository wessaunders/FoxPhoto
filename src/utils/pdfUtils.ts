import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    '../../pdf.worker.min.mjs',
    import.meta.url,
).toString();

export interface PdfInfo {
    pageCount: number;
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
}

export class PdfRenderer {
    private static cache = new Map<string, pdfjsLib.PDFDocumentProxy>();

    static async loadDocument(filePath: string): Promise<pdfjsLib.PDFDocumentProxy> {
        if (this.cache.has(filePath)) {
            return this.cache.get(filePath)!;
        }

        try {
            // In Electron, we need to read the file as ArrayBuffer
            const arrayBuffer = await this.readFileAsArrayBuffer(filePath);
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            this.cache.set(filePath, pdf);
            return pdf;
        } catch (error) {
            console.error('Error loading PDF:', error);
            throw error;
        }
    }

    static async readFileAsArrayBuffer(filePath: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const fs = require('fs');
            fs.readFile(filePath, (err: any, data: Buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
                }
            });
        });
    }

    static async getPdfInfo(filePath: string): Promise<PdfInfo> {
        try {
            const pdf = await this.loadDocument(filePath);
            const metadata = await pdf.getMetadata();
            const info = metadata.info as {
                Title?: string;
                Author?: string;
                Subject?: string;
                Creator?: string;
            };

            return {
                pageCount: pdf.numPages,
                title: info?.Title || undefined,
                author: info?.Author || undefined,
                subject: info?.Subject || undefined,
                creator: info?.Creator || undefined,
            };
        } catch (error) {
            console.error('Error getting PDF info:', error);
            throw error;
        }
    }

    static async renderPage(
        filePath: string,
        pageNumber: number,
        scale: number = 1
    ): Promise<string> {
        try {
            const pdf = await this.loadDocument(filePath);
            const page = await pdf.getPage(pageNumber);

            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
                throw new Error('Could not get canvas context');
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
                canvas: canvas
            };

            await page.render(renderContext).promise;
            return canvas.toDataURL();
        } catch (error) {
            console.error('Error rendering PDF page:', error);
            throw error;
        }
    }

    static async generateThumbnail(filePath: string, maxSize: number = 200): Promise<string> {
        try {
            const pdf = await this.loadDocument(filePath);
            const page = await pdf.getPage(1); // Always use first page for thumbnail

            const originalViewport = page.getViewport({ scale: 1 });
            const scale = Math.min(maxSize / originalViewport.width, maxSize / originalViewport.height);
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
                throw new Error('Could not get canvas context');
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
                canvas: canvas
            };

            await page.render(renderContext).promise;
            return canvas.toDataURL();
        } catch (error) {
            console.error('Error generating PDF thumbnail:', error);
            throw error;
        }
    }

    static clearCache(): void {
        this.cache.clear();
    }
}
