// Preload script exposes electronAPI on the window object
const electronAPI = window.electronAPI;

export const createSettingsSlice = (set, get) => ({
    startingPath: null,
    slideshowDelay: 3000,
    slideshowEffect: 'fade',
    loadSettings: async () => {
        const settings = await electronAPI.loadSettings();
        if (settings) {
            set({
                startingPath: settings.startingPath,
                slideshowDelay: settings.slideshowDelay,
                slideshowEffect: settings.slideshowEffect,
            });
        }
    },
    saveSettings: async () => {
        const { startingPath, slideshowDelay, slideshowEffect } = get();
        const settings = { startingPath, slideshowDelay, slideshowEffect };
        await electronAPI.saveSettings(settings);
    },
    setSlideshowDelay: (delay) => {
        set({ slideshowDelay: delay });
        get().saveSettings();
    },
    setSlideshowEffect: (effect) => {
        set({ slideshowEffect: effect });
        get().saveSettings();
    },
    setStartingPath: (path) => {
        set({ startingPath: path });
        get().saveSettings();
    },
});