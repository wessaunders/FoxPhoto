import { useState, useEffect } from 'react';
import { IconFileBroken } from '@tabler/icons-react';
import { SimpleGrid, Card, Checkbox, Flex, Image, Text, LoadingOverlay, Alert, Box, Skeleton } from '@mantine/core';
import ImageThumbnail from './ImageThumbnail';
import useFoxPhotoStore from './store/store';


const ThumbnailGrid = () => {
    const { 
        directories,
        error,
        images,
        loadingState,
        readDirectory,
        selectImage,
        selectedImagesForSlideshow, 
        toggleImageForSlideshow
    } = useFoxPhotoStore();

    const handleThumbnailClick = (image) => {
        selectImage(image.path);
    };

    const handleDirectoryClick = (directory) => {
        readDirectory(directory.path);
    };

    if (error) {
        return (
            <Alert title="Error" color="red">
                Failed to read directory: {error}
            </Alert>
        );
    }

    if (images.length === 0) {
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

    const allItems = [
        ...directories.map(dir => ({ ...dir, type: 'directory' })),
        ...images.map(img => ({ ...img, type: 'image' }))
    ];

    return (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md" style={{ position: 'relative' }}>
            {allItems.map((item) => (
                <Box
                    key={item.path}
                    style={{
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        borderRadius: 'var(--mantine-radius-md)',
                        boxShadow: 'var(--mantine-shadow-xs)',
                    }}
                >
                    {item.type === 'image' && (
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            onClick={() => handleThumbnailClick(item)}
                        >
                            <Box style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                                <Image
                                    src={item.path}
                                    alt={item.name}
                                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                />
                            </Box>
                            <Text truncate mt="xs" size="sm" ta="center">{item.name}</Text>
                            <Checkbox
                                checked={selectedImagesForSlideshow.includes(item.path)}
                                onChange={() => toggleImageForSlideshow(item.path)}
                                onClick={(e) => e.stopPropagation()} // Prevent parent click from firing
                                style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    zIndex: 2,
                                }}
                            />
                        </Flex>
                    )}
                    {item.type === 'directory' && (
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            onClick={() => handleDirectoryClick(item)}
                        >
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
    );
}

export default ThumbnailGrid;
