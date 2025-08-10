import { ActionIcon, Alert, Box, Group, Image, LoadingOverlay, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import useFoxPhotoStore from "./store/store";
import { IconArrowsDiagonal } from "@tabler/icons-react";

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
                const url = selectedImage 
                    ? await window.electronAPI.readImage(selectedImage) 
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

        if (selectedImage) {
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
            { selectedImage &&
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
                                style={{ objectFit: 'contain', maxHeight: '90vh', maxWidth: '90vw' }}
                            />
                        )}
                    </Box>
                    <Group>
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