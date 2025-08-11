import { create } from 'zustand';
import { createDirectorySlice, DirectorySlice } from './createDirectorySlice';
import { createHotkeysSlice, HotkeysSlice } from './createHotkeysSlice';
import { createSearchSlice, SearchSlice } from './createSearchSlice';
import { createSettingsSlice, SettingsSlice } from './createSettingsSlice';
import { createSlideshowSlice, SlideshowSlice } from './createSlideshowSlice';

export type FoxPhotoStoreState =
    DirectorySlice &
    HotkeysSlice &
    SearchSlice &
    SettingsSlice &
    SlideshowSlice;

const useFoxPhotoStore = create<FoxPhotoStoreState>((set, get) => ({
    ...createDirectorySlice(set, get),
    ...createHotkeysSlice(set, get),
    ...createSearchSlice(set, get),
    ...createSettingsSlice(set, get),
    ...createSlideshowSlice(set, get)
}));

export default useFoxPhotoStore;
