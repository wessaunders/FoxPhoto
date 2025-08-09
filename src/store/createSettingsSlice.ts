export interface SettingsSlice {
    startingPath: string | null;
    slideshowDelay: number;
    slideshowEffect: string;
    loadSettings: () => Promise<void>;
    saveSettings: () => Promise<void>;
    setSlideshowDelay: (delay: number) => void;
    setSlideshowEffect: (effect: string) => void;
    setStartingPath: (path: string) => void;
}

export const createSettingsSlice = (set, get): SettingsSlice => ({
    startingPath: null,
    slideshowDelay: 3000,
    slideshowEffect: 'fade',
    loadSettings: async () => {
        const settings = await window.electronAPI.loadSettings();
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
        await window.electronAPI.saveSettings(settings);
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