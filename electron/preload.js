const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getRootDirs: () => ipcRenderer.invoke('get-root-dirs'),
    loadSettings: () => ipcRenderer.invoke('load-settings'),
    readDirectory: (folderPath) => ipcRenderer.invoke('read-directory', folderPath),
    readImage: (imagePath) => ipcRenderer.invoke('read-image', imagePath),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
});
