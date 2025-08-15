import { 
    Alert, 
    Box, 
    Checkbox, 
    Flex, 
    Image, 
    ScrollArea, 
    SimpleGrid, 
    Text 
} from '@mantine/core';
import { DirectoryType, ImageType, ItemType, PdfType } from './interfaces/ui'; 
import { IconFileBroken } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import ImageThumbnail from './ImageThumbnail';
import PdfThumbnail from './PdfThumbnail';
import useFoxPhotoStore from './store/store';


const ThumbnailGrid = () => {
    const { 
        directories,
        error,
        images,
        loadingState,
        pdfs,
        readDirectory,
        selectImage,
        selectedImagesForSlideshow,
        thumbnailSize, 
        toggleImageForSlideshow
    } = useFoxPhotoStore();

    const gridRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(window.innerWidth);
    const [cols, setCols] = useState<number>(4);

    useEffect(() => {
        if (gridRef && gridRef.current) {
            setContainerWidth(gridRef.current.offsetWidth);
        }
    }, [gridRef]);

    useEffect(() => {
        if (containerWidth && thumbnailSize) {
            const minColumnWidth = thumbnailSize + 24;
            const calculatedColumns = Math.max(1, Math.floor(containerWidth / minColumnWidth));
            setCols(calculatedColumns);
        }
    }, [containerWidth, thumbnailSize])

    const handleDirectoryClick = (directory: DirectoryType) => {
        readDirectory(directory.path);
    };

    if (error) {
        return (
            <Alert title="Error" color="red">
                Failed to read directory: {error}
            </Alert>
        );
    }

    if (images.length === 0 && pdfs.length === 0) {
        if (!loadingState.isScanning) {
            return (
                <Box p="md">
                    <Text c="dimmed">No images found in this folder.</Text>
                </Box>
            );
        }

        if (directories.length === 0) {
            return (
                <Flex direction="column" justify="center" align="center" style={{ minHeight: 'calc(100vh - 200px)' }}>
                    <IconFileBroken size={48} color="var(--mantine-color-dimmed)" />
                    <Text mt="md" c="dimmed">This folder is empty.</Text>
                </Flex>
            );
        }
    } 

    const allItems: ItemType[] = [
        ...directories.map(dir => ({ ...dir, type: 'directory' as const })),
        ...images.map(img => ({ ...img, type: 'image' as const })),
        ...pdfs.map(pdf => ({ ...pdf, type: 'pdf' as const }))
    ];

    return (
        <ScrollArea h="calc(100vh - 192px)">
            <SimpleGrid 
                cols={cols}
                spacing="md" 
                style={{ position: 'relative' }}>
                {allItems.map((item) => (
                    <Box
                        key={item.path}
                        style={{
                            position: 'relative',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            borderRadius: 'var(--mantine-radius-md)',
                            boxShadow: 'var(--mantine-shadow-xs)'
                        }}
                    >
                        {item.type === 'image' && (
                            <ImageThumbnail 
                                image={item} />
                        )}
                        {item.type === 'pdf' && (
                            <PdfThumbnail 
                                key={item.path}
                                filePath={item.path}
                                fileName={item.name} />
                        )}
                        {item.type === 'directory' && (
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                onClick={() => handleDirectoryClick(item)}>
                                <Box style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                                    <Box
                                        style={{
                                            backgroundColor: 'var(--mantine-color-gray-2)',
                                            height: '100%',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text size="xl">📁</Text>
                                    </Box>
                                </Box>
                                <Text truncate mt="xs" size="sm" ta="center">{item.name}</Text>
                            </Flex>
                        )}
                    </Box>
                ))}

                {/* {images.map((image) => (
                <ImageThumbnail key={image.path} image={image} selectImage={selectImage} />
            ))} */}
            </SimpleGrid>
        </ScrollArea>
    );
}

export default ThumbnailGrid;
