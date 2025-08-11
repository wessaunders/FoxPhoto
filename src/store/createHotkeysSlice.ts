export interface HotkeysSlice {
    keyboardShortcutsOpened: boolean,
    toggleKeyboardShortcuts: () => void; 
}

export const createHotkeysSlice = (set, get): HotkeysSlice => ({
    keyboardShortcutsOpened: false,
    toggleKeyboardShortcuts: () => {
        set({ keyboardShortcutsOpened: !get().keyboardShortcutsOpened });
    }
});