const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    generatePdfThumbnail: (filePath) => ipcRenderer.invoke('generate-pdf-thumbnail', filePath),
    getPdfPageCount: (filePath) => ipcRenderer.invoke('get-pdf-page-count', filePath),
    getRootDirs: () => ipcRenderer.invoke('get-root-dirs'),
    loadSettings: () => ipcRenderer.invoke('load-settings'),
    readDirectory: (folderPath) => ipcRenderer.invoke('read-directory', folderPath),
    readImage: (imagePath) => ipcRenderer.invoke('read-image', imagePath),
    renderPdfPage: (filePath, pageNumber, scale) => ipcRenderer.invoke('render-pdf-page', filePath, pageNumber, scale),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
});
