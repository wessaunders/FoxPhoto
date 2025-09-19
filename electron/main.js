const { app, BrowserWindow, ipcMain } = require('electron');
const { imageSizeFromFile } = require('image-size/fromFile')
const exifr = require('exifr');
const piexif = require('piexifjs');
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

ipcMain.handle('read-file-as-array-buffer', async (event, filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
            }
        });
    });
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

// IPC handler to get EXIF data from an image
ipcMain.handle('get-exif-data', async (event, imagePath) => {
    try {
        const exifData = await exifr.parse(imagePath);
        return exifData || {};
    } catch (error) {
        console.error(`Failed to read EXIF data from ${imagePath}:`, error);
        return {};
    }
});

// IPC handler to update EXIF data in an image
ipcMain.handle('update-exif-data', async (event, imagePath, exifUpdates) => {
    try {
        // Read the original image file
        const imageBuffer = await fs.promises.readFile(imagePath);
        const imageDataUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

        // Get existing EXIF data
        const exifObj = piexif.load(imageDataUrl);

        // Update EXIF fields based on the provided updates
        Object.entries(exifUpdates).forEach(([key, value]) => {
            switch (key) {
                case 'Make':
                    exifObj['0th'][piexif.ImageIFD.Make] = value;
                    break;
                case 'Model':
                    exifObj['0th'][piexif.ImageIFD.Model] = value;
                    break;
                case 'DateTime':
                    exifObj['0th'][piexif.ImageIFD.DateTime] = value;
                    break;
                case 'DateTimeOriginal':
                    exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal] = value;
                    break;
                case 'Software':
                    exifObj['0th'][piexif.ImageIFD.Software] = value;
                    break;
                case 'Artist':
                    exifObj['0th'][piexif.ImageIFD.Artist] = value;
                    break;
                case 'Copyright':
                    exifObj['0th'][piexif.ImageIFD.Copyright] = value;
                    break;
                case 'ImageDescription':
                    exifObj['0th'][piexif.ImageIFD.ImageDescription] = value;
                    break;
                case 'FNumber':
                    if (value) {
                        // FNumber is stored as a rational number [numerator, denominator]
                        const fNumber = Math.round(value * 10);
                        exifObj['Exif'][piexif.ExifIFD.FNumber] = [fNumber, 10];
                    }
                    break;
                case 'ExposureTime':
                    if (value) {
                        // ExposureTime is stored as a rational number
                        const denominator = Math.round(1 / value);
                        exifObj['Exif'][piexif.ExifIFD.ExposureTime] = [1, denominator];
                    }
                    break;
                case 'ISO':
                    if (value) {
                        exifObj['Exif'][piexif.ExifIFD.ISOSpeedRatings] = value;
                    }
                    break;
                case 'FocalLength':
                    if (value) {
                        // FocalLength is stored as a rational number
                        const focalLength = Math.round(value * 1);
                        exifObj['Exif'][piexif.ExifIFD.FocalLength] = [focalLength, 1];
                    }
                    break;
                // Handle nested GPS data
                case 'GPS.GPSLatitude':
                case 'GPS.GPSLongitude':
                case 'GPS.GPSAltitude':
                    // GPS data handling would require more complex conversion
                    console.log(`GPS data update not yet implemented for ${key}`);
                    break;
                default:
                    console.log(`Unknown EXIF field: ${key}`);
                    break;
            }
        });

        // Convert the EXIF object back to bytes
        const exifBytes = piexif.dump(exifObj);

        // Insert the EXIF data into the image
        const newImageDataUrl = piexif.insert(exifBytes, imageDataUrl);

        // Convert back to buffer and save
        const base64Data = newImageDataUrl.replace(/^data:image\/jpeg;base64,/, '');
        const newImageBuffer = Buffer.from(base64Data, 'base64');

        // Create backup of original file
        const backupPath = `${imagePath}.backup`;
        await fs.promises.copyFile(imagePath, backupPath);

        try {
            // Write the updated image
            await fs.promises.writeFile(imagePath, newImageBuffer);

            // Remove backup if successful
            await fs.promises.unlink(backupPath);

            console.log(`Successfully updated EXIF data for ${imagePath}`);
            return { success: true };
        } catch (writeError) {
            // Restore from backup if write failed
            await fs.promises.copyFile(backupPath, imagePath);
            await fs.promises.unlink(backupPath);
            throw writeError;
        }

    } catch (error) {
        console.error(`Failed to update EXIF data for ${imagePath}:`, error);
        return { success: false, error: error.message };
    }
});
