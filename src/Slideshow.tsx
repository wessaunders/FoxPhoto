import { useEffect, useRef } from 'react';
import { Box, Button, Text, Group } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlayerPause, IconPlayerPlay, IconX } from '@tabler/icons-react';
import useFoxPhotoStore from './store/store';
import SlideshowControls from './SlideshowControls';
import './Slideshow.css';

const Slideshow = () => {
    const { 
        isSlideshowPaused,
        nextSlide,
        pauseSlideshow,
        playSlideshow,
        previousSlide,
        slideshowImages, 
        slideshowIndex, 
        slideshowDelay,
        slideshowEffect,
        stopSlideshow 
    } = useFoxPhotoStore();
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isSlideshowPaused) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            return;
        }

        // Clear any existing timer when the component re-renders or unmounts
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        // Set a new interval for the slideshow
        timerRef.current = setInterval(() => {
            nextSlide();
        }, slideshowDelay);

        // Cleanup function to clear the interval when the component unmounts
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isSlideshowPaused, slideshowIndex, slideshowDelay, nextSlide, slideshowImages.length]);

    if (slideshowImages.length === 0) {
        return null;
    }

    const currentImage = slideshowImages[slideshowIndex];
    const effectClassName = slideshowEffect === 'fade' ? 'fade-effect' : 'wipe-effect';

    return (
        <Box
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'var(--mantine-color-body)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}>

            <Box
                style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 1100,
                    pointerEvents: 'auto',
                }}>
                <SlideshowControls />
            </Box>

            <Box style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                    key={currentImage}
                    src={currentImage}
                    alt={`Slideshow image ${slideshowIndex + 1}`}
                    className={`slideshow-image ${effectClassName}`}
                />
            </Box>

            <Box
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                }}>
                <Button onClick={stopSlideshow} size="lg" color="red" variant="subtle" style={{borderRadius: '50%', padding: '0.5rem'}}>
                    <IconX size={24} />
                </Button>
            </Box>

            <Box
                style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}>
                <Group>
                    <Button onClick={previousSlide} size="lg" variant="filled" style={{borderRadius: '50%', padding: '0.5rem'}}>
                        <IconChevronLeft size={24} />
                    </Button>
                    <Button
                        onClick={isSlideshowPaused 
                            ? playSlideshow 
                            : pauseSlideshow}
                        size="lg"
                        variant="filled"
                        style={{ borderRadius: '50%', padding: '0.5rem' }}>
                        {isSlideshowPaused 
                            ? <IconPlayerPlay size={24} /> 
                            : <IconPlayerPause size={24} />
                        }
                    </Button>
                    <Button onClick={nextSlide} size="lg" variant="filled" style={{borderRadius: '50%', padding: '0.5rem'}}>
                        <IconChevronRight size={24} />
                    </Button>
                </Group>
            </Box>

            <Box
                style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                }}
            >
                <Text c="white" size="lg">
                    {slideshowIndex + 1} / {slideshowImages.length}
                </Text>
            </Box>
        </Box>
    );
};

export default Slideshow;
