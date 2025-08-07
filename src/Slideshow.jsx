import { useEffect, useRef, useState } from 'react';
import { Box, Flex, Button, Text, Group } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import useFoxPhotoStore from './store/store';
import SlideshowControls from './SlideshowControls';
import './Slideshow.css';

const Slideshow = () => {
    const { 
        slideshowImages, 
        slideshowIndex, 
        slideshowDelay,
        slideshowEffect,
        nextSlide,
        previousSlide,
        stopSlideshow 
    } = useFoxPhotoStore();
    
    const timerRef = useRef(null);
    const [currentImage, setCurrentImage] = useState(slideshowImages[slideshowIndex]);
    const [prevImage, setPrevImage] = useState(null);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        timerRef.current = setInterval(() => {
        nextSlide();
        }, slideshowDelay);

        return () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        };
    }, [slideshowIndex, slideshowDelay, nextSlide, slideshowImages.length]);

    useEffect(() => {
        setTransitioning(true);
        const newImage = slideshowImages[slideshowIndex];
        
        // Set a timeout to trigger the transition
        const transitionTimeout = setTimeout(() => {
        setPrevImage(currentImage);
        setCurrentImage(newImage);
        setTransitioning(false);
        }, 500); // This should be half of the CSS transition duration

        return () => clearTimeout(transitionTimeout);
    }, [slideshowIndex]);


    useEffect(() => {
        const handleKeyPress = (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            previousSlide();
        } else if (e.key === 'Escape') {
            stopSlideshow();
        }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
        window.removeEventListener('keydown', handleKeyPress);
        };
    }, [nextSlide, previousSlide, stopSlideshow]);
    
    if (slideshowImages.length === 0) {
        return null;
    }

    const baseImageStyle = {
        position: 'absolute',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        transition: 'all 1s ease-in-out',
    };

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
        }}
        >
        <Box style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {prevImage && (
                <img
                src={prevImage}
                alt="Previous"
                style={{ ...baseImageStyle, opacity: transitioning ? 0 : 1 }}
                />
            )}
            <img
                src={currentImage}
                alt="Current"
                style={{ 
                ...baseImageStyle, 
                opacity: transitioning ? 0 : 1,
                transform: slideshowEffect === 'wipe' && !transitioning ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 1s ease-out, opacity 1s ease-in',
                }}
            />
        </Box>

        {/* Controls */}
        <Box
            style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            }}
        >
            <Group>
            <SlideshowControls />
            <Button onClick={stopSlideshow} size="lg" color="red" variant="subtle" style={{borderRadius: '50%', padding: '0.5rem'}}>
                <IconX size={24} />
            </Button>
            </Group>
        </Box>

        <Box
            style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            }}
        >
            <Group>
            <Button onClick={previousSlide} size="lg" variant="filled" style={{borderRadius: '50%', padding: '0.5rem'}}>
                <IconChevronLeft size={24} />
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
