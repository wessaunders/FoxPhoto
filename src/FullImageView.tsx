import { useState, useEffect } from 'react';
import { Modal, Image, Button, Group, Box, LoadingOverlay, Alert } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import useFoxPhotoStore from './store/store';

const FullImageView = () => {
    const { selectedImage, images, closeImage, nextImage, prevImage } = useFoxPhotoStore();
    const [error, setError] = useState<string | null>(null);
    const [imageDataUrl, setImageDataUrl] = useState < string | null > (null);
    const [isLoading, setIsLoading] = useState(true);

    const currentIndex = images.findIndex((img: { path: string }) => img.path === selectedImage.path);
    const isFirstImage = currentIndex === 0;
    const isLastImage = currentIndex === images.length - 1;

    useEffect(() => {
        let isMounted = true;

        const fetchFullImage = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const url = selectedImage.path 
                    ? await window.electronAPI.readImage(selectedselectedImage.pathmage) 
                    : null;
                if (isMounted) {
                    if (url) {
                        setImageDataUrl(url);
                    } else {
                        setError("Failed to load image.");
                    }
                }
            } catch (e) {
                console.error("Failed to load full image:", e);
                if (isMounted) {
                    setError("Failed to load image.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (selectedImage && selectedImage.path) {
            fetchFullImage();
        }

        return () => {
            isMounted = false;
        };
    }, [selectedImage.path]);

    return (
        <Modal
            opened={!!selectedImage}
            onClose={closeImage}
            fullScreen
            withCloseButton={false}
            transitionProps={{ transition: 'fade', duration: 200 }}
            styles={{
                content: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                },
                body: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                }
            }}>
            <Box style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                {error ? (
                    <Alert title="Error" color="red">
                        {error}
                    </Alert>
                ) : (
                    <Image
                        src={imageDataUrl}
                        alt="Full-sized image"
                        style={{ 
                            objectFit: 'contain', 
                            maxHeight: '90vh', 
                            maxWidth: '90vw',
                            transform: `rotate(${selectedImage.rotation}deg)` 
                        }}
                    />
                )}
            </Box>

            {/* Navigation and Close Buttons */}
            <Group style={{ position: 'absolute', bottom: '1rem', width: '100%', justifyContent: 'center' }} gap="xl">
                <Button
                    variant="light"
                    leftSection={<IconChevronLeft size={20} />}
                    onClick={prevImage}
                    disabled={isFirstImage}
                    radius="md">
                    Previous
                </Button>
                <Button
                    variant="filled"
                    onClick={closeImage}
                    radius="md">
                    Close
                </Button>
                <Button
                    variant="light"
                    rightSection={<IconChevronRight size={20} />}
                    onClick={nextImage}
                    disabled={isLastImage}
                    radius="md">
                    Next
                </Button>
            </Group>
        </Modal>
    );
}

export default FullImageView;
