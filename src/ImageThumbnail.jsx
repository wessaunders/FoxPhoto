import { useState, useEffect } from 'react';
import { SimpleGrid, Card, Image, Text, LoadingOverlay, Alert, Box, Skeleton } from '@mantine/core';
import { IconPhotoOff } from '@tabler/icons-react';
import useFoxPhotoStore from './store/store';

const ImageThumbnail = ({ image, selectImage }) => {
    const { dataUrl, isLoading } = useImageDataLoader(image.path);

    return (
        <Card
            shadow="sm"
            p="xs"
            radius="md"
            withBorder
            style={{ cursor: 'pointer', aspectRatio: '1 / 1' }}
            onClick={() => selectImage(image.path)}>
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

export default ImageThumbnail;