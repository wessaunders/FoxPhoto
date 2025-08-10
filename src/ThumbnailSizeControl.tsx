import { Slider } from '@mantine/core';
import useFoxPhotoStore from './store/store';

const ThumbnailSizeControl = () => {
    const { thumbnailSize, setThumbnailSize } = useFoxPhotoStore();
    
    return (
        <Slider
            label="Thumbnail Size"
            min={120}
            max={300}
            step={10}
            value={thumbnailSize}
            onChange={setThumbnailSize}
            marks={[
                { value: 120, label: 'S' },
                { value: 180, label: 'M' },
                { value: 240, label: 'L' },
                { value: 300, label: 'XL' },
            ]}
            style={{ width: 200 }}
        />
    );
};

export default ThumbnailSizeControl;