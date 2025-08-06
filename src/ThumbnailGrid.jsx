import React, { useState, useEffect } from 'react';
import { SimpleGrid, Card, Image, Text, LoadingOverlay, Alert, Box, Skeleton } from '@mantine/core';
import { IconPhotoOff } from '@tabler/icons-react';
import useFoxPhotoStore from './store';

// Custom hook to read and cache image data
const useImageDataLoader = (imagePath) => {
    const [dataUrl, setDataUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
        try {
            const url = await window.electronAPI.readImage(imagePath);
            if (isMounted) {
                setDataUrl(url);
            }
        } catch (error) {
            console.error("Failed to load image:", imagePath, error);
            if (isMounted) {
                setDataUrl(null);
            }
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }
        };
        fetchImage();
        return () => {
            isMounted = false;
        };
    }, [imagePath]);

    return { dataUrl, isLoading };
};

function ThumbnailGrid() {
    const { images, selectImage, loadingState, error } = useFoxPhotoStore();

    if (error) {
        return (
        <Alert title="Error" color="red">
            Failed to read directory: {error}
        </Alert>
        );
    }

    if (images.length === 0 && !loadingState.isScanning) {
        return (
        <Box p="md">
            <Text c="dimmed">No images found in this folder.</Text>
        </Box>
        );
    }

    return (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md" style={{ position: 'relative' }}>
        {images.map((image) => (
            <ImageThumbnail key={image.path} image={image} selectImage={selectImage} />
        ))}
        </SimpleGrid>
    );
}

const ImageThumbnail = ({ image, selectImage }) => {
    const { dataUrl, isLoading } = useImageDataLoader(image.path);

    return (
        <Card
        shadow="sm"
        p="xs"
        radius="md"
        withBorder
        style={{ cursor: 'pointer', aspectRatio: '1 / 1' }}
        onClick={() => selectImage(image.path)}
        >
        <Card.Section>
            {isLoading ? (
            <Skeleton height={150} />
            ) : dataUrl ? (
            <Image src={dataUrl} alt={image.name} height={150} fit="cover" />
            ) : (
            <Box h={150} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--mantine-color-dark-4)' }}>
                <IconPhotoOff size={48} color="var(--mantine-color-dimmed)" />
                <Text size="sm" c="dimmed" mt="xs">{image.name}</Text>
            </Box>
            )}
        </Card.Section>
        </Card>
    );
};

export default ThumbnailGrid;
