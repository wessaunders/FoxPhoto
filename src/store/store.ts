import { create } from 'zustand';
import { createDirectorySlice, DirectorySlice } from './createDirectorySlice';
import { createHotkeysSlice, HotkeysSlice } from './createHotkeysSlice';
import { createImageInfoSlice, ImageInfoSlice } from './createImageInfoSlice';
import { createSearchSlice, SearchSlice } from './createSearchSlice';
import { createSettingsSlice, SettingsSlice } from './createSettingsSlice';
import { createSlideshowSlice, SlideshowSlice } from './createSlideshowSlice';

export type FoxPhotoStoreState =
    DirectorySlice &
    HotkeysSlice &
    ImageInfoSlice &
    SearchSlice &
    SettingsSlice &
    SlideshowSlice;

const useFoxPhotoStore = create<FoxPhotoStoreState>((set, get) => ({
    ...createDirectorySlice(set, get),
    ...createHotkeysSlice(set, get),
    ...createImageInfoSlice(set, get),
    ...createSearchSlice(set, get),
    ...createSettingsSlice(set, get),
    ...createSlideshowSlice(set, get)
}));

export default useFoxPhotoStore;
