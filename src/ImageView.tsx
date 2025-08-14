import { ActionIcon, Alert, Box, Group, Image, LoadingOverlay, Stack } from "@mantine/core";
import { IconArrowsDiagonal } from "@tabler/icons-react";
import { FileTypes } from "./interfaces/ui";
import { useEffect, useState } from "react";
import useFoxPhotoStore from "./store/store";

const ImageView = () => {
    const { selectedImage, setShowFullSizeImage } = useFoxPhotoStore();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchFullImage = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const url = selectedImage.path 
                    ? await window.electronAPI.readImage(selectedImage.path) 
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
    }, [selectedImage]);
    
    const toggleShowSelectedImageFullSize = () => {
        setShowFullSizeImage();
    }

    return (
        <>
            {selectedImage &&
                selectedImage.type === FileTypes.ImageType &&
                <Stack>
                    <Box style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                        {error ? (
                            <Alert title="Error" color="red">
                                {error}
                            </Alert>
                        ) : (
                            <Image
                                src={imageDataUrl}
                                alt="Image"
                                style={{ 
                                    objectFit: 'contain', 
                                    maxHeight: '90vh', 
                                    maxWidth: '90vw',
                                    transform: `rotate(${selectedImage.rotation}deg)` 
                                }}
                            />
                        )}
                    </Box>
                    <Group justify="flex-end">
                        <ActionIcon
                            onClick={toggleShowSelectedImageFullSize}>
                            <IconArrowsDiagonal size={24} />
                        </ActionIcon>
                    </Group>
                </Stack>
            }
        </>
    )
}

export default ImageView;