# FoxPhoto: A Cross-Platform Desktop Image Viewer

FoxPhoto is a desktop application built with Electron, React v19, and Zustand, designed to provide a simple yet powerful way to browse and view images on your local file system.

## ✨ Features

* **File System Navigation:** Easily browse your drives and folders.
* **Thumbnail Grid:** View all images in a selected folder as a responsive grid of thumbnails.
* **Full Image View:** Open images in a full-screen mode with navigation controls (next/previous).
* **Advanced Search:** Search and order by name, date, and resolution
* **Loading & Error Handling:** Visual feedback for loading states and graceful handling of errors.
* **Modern UI:** Clean and intuitive user interface powered by Mantine UI.

## 🚀 Getting Started

Follow these instructions to set up, run, and build the FoxPhoto application.

### Prerequisites

* **Node.js:** Ensure you have Node.js (v18 or newer recommended) installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
* **npm (Node Package Manager):** npm is typically installed with Node.js.

### Installation

1.  **Clone the Repository (or create the files manually):**
    If you're starting from scratch, create a new directory and create the files provided above (`package.json`, `index.html`, `vite.config.js`, `electron\main.js`, `electron\preload.js`, `src/store.js`, `src/App.jsx`, `src/FileExplorer.jsx`, `src/ThumbnailGrid.jsx`, and `src/FullImageView.jsx`, and the `src/components/ui` and `src/lib` folders with their contents).

2.  **Navigate to the Project Directory:**
    ```bash
    cd foxphoto
    ```

3.  **Install Dependencies:**
    Install all the required npm packages.
    ```bash
    npm install
    ```
## 🏃 Running the Application

### Development Mode

To run the application in development mode (with hot-reloading for React and Electron console access):

```bash
npm run electron-dev
```

This command will:
* Start the Vite development server for the React frontend.
* Launch the Electron application, which will load the React app from the Vite server.
* Open developer tools for both the Electron main process and the React renderer process.

### Production Mode

To run a pre-built version of the application (after building it):

1.  **Build the React Frontend:**
    ```bash
    npm run build
    ```
    This will create a `dist` folder containing the optimized React build.

2.  **Start Electron:**
    ```bash
    npm start
    ```
    This will launch the Electron application using the `main.js` file and load the `index.html` from the `dist` folder.

## 📦 Building for Production

To create distributable packages for your operating system (Windows, macOS, Linux):

1.  **Build the React Frontend (if you haven't already):**
    ```bash
    npm run build
    ```

2.  **Package the Electron Application:**
    ```bash
    npm run electron-dist
    ```
    This command uses `electron-builder` to create an installer or executable package in the `dist` directory of your project. The type of package created depends on your operating system.

    * **For specific platforms:**
        * Windows: `npm run electron-dist -- --win`
        * macOS: `npm run electron-dist -- --mac`
        * Linux: `npm run electron-dist -- --linux`

## ⚙️ Project Structure

```
foxphoto/
├── index.html                          # Main HTML for the Electron renderer
├── package.json                        # Project metadata and dependencies
├── electron/
│   ├── main.js                         # Electron Main Process (backend operations)
│   ├── preload.js                      # Electron Preload Script (secure IPC bridge)
└── src/
    ├── hooks/
    │   └── useImageDataLoader.js
    ├── store/
    │   ├── createDirectorySlice.js    # Zustand store slice containing directory functionality
    │   ├── createSearchSlice.ts       # Zustand store slice containing search functionality
    │   ├── createSetingsSlice.js      # Zustand store slice containing persistent settings functionality
    │   ├── createSlideshowSlice.ts    # Zustand store slice containing slideshow functionality
    │   └── store.js                    # Zustand global state store
    ├── AdvancedSearchModal.tsx         # Advanced search modal component
    ├── AppFooter.tsx                   # Main React application footer component
    ├── AppHeader.tsx                   # Main React application header component
    ├── App.tsx                         # Main React application component
    ├── FileExplorer.tsx                # File explorer component
    ├── FullImageView.tsx               # Full image view component
    ├── ImageThumbnail.tsx              # Thumbnail image component
    ├── main.tsx            
    ├── Slideshow.tsx                   # Slideshow component
    ├── SlideshowControls.tsx           # Slideshow controls component
    └── ThumbnailGrid.tsx               # Thumbnail grid component
```

## 🔒 Security Considerations

FoxPhoto is designed with Electron security best practices in mind:

* **`nodeIntegration: false`**: The renderer process (where React runs) does not have direct access to Node.js APIs. This prevents malicious code from accessing your file system or other system resources.
* **`contextIsolation: true`**: Electron APIs and your web content run in separate JavaScript contexts, preventing interference.
* **`preload.js`**: All necessary Node.js functionalities (like file system access) are exposed to the renderer process exclusively through a secure `preload.js` script via `contextBridge`. This ensures that only explicitly defined and safe functions are available to the UI.

## 🤝 Contributing

Feel free to fork this repository, open issues, or submit pull requests.