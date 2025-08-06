const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getRootDirs: () => ipcRenderer.invoke('get-root-dirs'),
    readDirectory: (folderPath) => ipcRenderer.invoke('read-directory', folderPath),
    readImage: (imagePath) => ipcRenderer.invoke('read-image', imagePath),
});
