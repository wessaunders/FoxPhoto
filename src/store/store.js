import { create } from 'zustand';
import { createDirectorySlice } from './createDirectorySlice';
import { createSearchSlice } from './createSearchSlice';
import { createSettingsSlice } from './createSettingsSlice';
import { createSlideshowSlice } from './createSlideshowSlice';

const useFoxPhotoStore = create((...a) => ({
    ...createDirectorySlice(...a),
    ...createSearchSlice(...a),
    ...createSettingsSlice(...a),
    ...createSlideshowSlice(...a)
}));

export default useFoxPhotoStore;
