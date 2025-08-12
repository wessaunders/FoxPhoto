const { app, BrowserWindow, ipcMain } = require('electron');
const { imageSizeFromFile } = require('image-size/fromFile') 
const exifr = require('exifr');
const fs = require('fs');
const path = require('path');


const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // Security best practices
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
        },
    });

    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        win.removeMenu();
        win.loadFile(path.join(__dirname, '../dist/renderer/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Main process IPC handlers
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.tif', '.ico'];
const PDF_EXTENSIONS = ['.pdf'];

// Function to get image metadata
const getImageMetadata = async (filePath) => {
    const stats = fs.statSync(filePath);
    let width = null, height = null;
    try {
        const dimensions = await imageSizeFromFile(filePath)
        height = dimensions.height;
        width = dimensions.width;
    } 
    catch { }
    return {
        mtime: stats.mtime,
        width,
        height,
    };
};

// Function to get root drives on Windows/Linux or root directory on macOS
const getRootDrives = () => {
    if (process.platform === 'win32') {
        const drives = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(d => `${d}:\\`);
        return drives.filter(d => {
        try {
            fs.accessSync(d, fs.constants.F_OK);
            return true;
        } catch (err) {
            return false;
        }
        });
    } else {
        // For macOS and Linux, the root is '/'
        return ['/'];
    }
};

ipcMain.handle('generate-pdf-thumbnail', async (event, filePath) => {
    try {
        // We'll use pdf-poppler or pdf2pic for server-side PDF thumbnail generation
        // For now, we'll return null and handle PDF rendering in the frontend
        return null;
    } catch (error) {
        console.error('Error generating PDF thumbnail:', error);
        return null;
    }
});

ipcMain.handle('get-pdf-page-count', async (event, filePath) => {
    try {
        // This would require a PDF library in the main process
        // For simplicity, we'll handle this in the frontend
        return null;
    } catch (error) {
        console.error('Error getting PDF page count:', error);
        return null;
    }
});

// IPC handler to get root directories
ipcMain.handle('get-root-dirs', async () => {
    try {
        return getRootDrives();
    } catch (error) {
        console.error('Failed to get root directories:', error);
        return [];
    }
});

ipcMain.handle('load-settings', async () => {
    const settingsPath = path.join(app.getPath('userData'), 'settings.json');
    try {
        const settingsData = await fs.promises.readFile(settingsPath, 'utf-8');
        return JSON.parse(settingsData);
    } catch (error) {
        // If file doesn't exist, return null to indicate no saved settings
        if (error.code === 'ENOENT') {
            return null;
        }
        console.error('Failed to load settings:', error);
        return null;
    }
});

// IPC handler to read a directory
ipcMain.handle('read-directory', async (event, folderPath) => {
    try {
        const files = fs.readdirSync(folderPath, { withFileTypes: true });
        const directories = [];
        const images = [];
        const pdfs = [];

        for (const file of files) {
            const fullPath = path.join(folderPath, file.name);
            if (file.isDirectory()) {
                directories.push({ name: file.name, path: fullPath });
            } else if (file.isFile()) {
                if (IMAGE_EXTENSIONS.includes(path.extname(file.name).toLowerCase())) {
                    let exif = {};

                    try {
                        exif = await exifr.parse(fullPath);
                    } catch (error) {
                        console.warn(`Attempted to get exif information from a non-image file: ${fullPath}`);
                    }

                    const meta = await getImageMetadata(fullPath);
                    images.push({ name: file.name, path: fullPath, ...meta, ...exif });
                }

                if (PDF_EXTENSIONS.includes(path.extname(file.name).toLowerCase())) {
                    pdfs.push({ name: file.name, path: fullPath });
                }
            }
        }

        return { directories, images, pdfs };
    } catch (error) {
        console.error(`Failed to read directory ${folderPath}:`, error);

        return { directories: [], images: [], pdfs: [], error: error.message };
    }
});

// IPC handler to read an image and return as a data URL
ipcMain.handle('read-image', async (event, imagePath) => {
    try {
        const buffer = fs.readFileSync(imagePath);
        const mimeType = `image/${path.extname(imagePath).substring(1)}`;
        const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
        return dataUrl;
    } catch (error) {
        console.error(`Failed to read image ${imagePath}:`, error);
        return null;
    }
});

ipcMain.handle('render-pdf-page', async (event, filePath, pageNumber, scale = 1) => {
    try {
        // This would be handled by PDF.js in the frontend
        return null;
    } catch (error) {
        console.error('Error rendering PDF page:', error);
        return null;
    }
});

ipcMain.handle('save-settings', async (event, settings) => {
    const settingsPath = path.join(app.getPath('userData'), 'settings.json');

    try {
        await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Failed to save settings:', error);
        return { success: false, error: error.message };
    }
});
