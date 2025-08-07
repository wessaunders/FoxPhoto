import React, { useEffect, useRef } from 'react';
import { Box, Button, Text, Group } from '@mantine/core';
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

    useEffect(() => {
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
    }, [slideshowIndex, slideshowDelay, nextSlide, slideshowImages.length]);

    // Handle key presses for navigation
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
        }}
        >
        <Box style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
            key={currentImage}
            src={currentImage}
            alt={`Slideshow image ${slideshowIndex + 1}`}
            className={`slideshow-image ${effectClassName}`}
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
