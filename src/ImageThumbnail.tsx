import { Box, Flex, Image, Text } from '@mantine/core';
import { ItemType } from './interfaces/ui';
import useFoxPhotoStore from './store/store';

interface ImageThumbnailProps {
    image: ItemType;
}

const ImageThumbnail = (props: ImageThumbnailProps) => {
    const { image } = props;
    const {
        selectImage,
        selectedImagesForSlideshow,
        toggleImageForSlideshow
    } = useFoxPhotoStore();


    const handleThumbnailClick = (e: React.MouseEvent, image: ItemType) => {
        if (e.shiftKey) {
            // Shift was held during click
            toggleImageForSlideshow(image.path);
        } else {
            // Normal click
            selectImage(image.path);
        }        
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            onClick={(e) => handleThumbnailClick(e, image)}
            style={{
                cursor: 'pointer',
                transform: selectedImagesForSlideshow.includes(image.path) ? 'scale(1.02)' : undefined,
                transition: 'all 0.2s ease'                
            }}>
            <Box 
                style={{ 
                    width: '100%', 
                    aspectRatio: '1/1', 
                    overflow: 'hidden',
                    borderBottom: selectedImagesForSlideshow.includes(image.path)
                        ? '1px solid var(--mantine-color-blue-6)'
                        : undefined,
                    borderLeft: selectedImagesForSlideshow.includes(image.path)
                        ? '3px solid var(--mantine-color-blue-6)'
                        : undefined,
                    borderRight: selectedImagesForSlideshow.includes(image.path)
                        ? '3px solid var(--mantine-color-blue-6)'
                        : undefined,
                    borderTop: selectedImagesForSlideshow.includes(image.path)
                        ? '3px solid var(--mantine-color-blue-6)'
                        : undefined                    
                }}>
                <Image
                    src={image.path}
                    alt={image.name}
                    style={{ 
                        objectFit: 'cover', 
                        height: '100%', 
                        width: '100%' }}
                />
            </Box>
            <Text truncate mt="xs" size="sm" ta="center">{image.name}</Text>
            {/* <Checkbox
                checked={selectedImagesForSlideshow.includes(item.path)}
                onChange={() => toggleImageForSlideshow(item.path)}
                onClick={(e) => e.stopPropagation()} // Prevent parent click from firing
                style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    zIndex: 2,
                }}
            /> */}
        </Flex>
    );
};

export default ImageThumbnail;