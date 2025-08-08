import { Box, Flex, Group, SegmentedControl, Slider, Stack, Text, Card, Tooltip } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useState } from 'react';
import useFoxPhotoStore from './store/store';

const SlideshowControls = () => {
    const {
        slideshowDelay,
        setSlideshowDelay,
        slideshowEffect,
        setSlideshowEffect,
    } = useFoxPhotoStore();
    const [hovered, setHovered] = useState(false);

    return (
        <Card 
            withBorder 
            radius="md" 
            p="md" 
            shadow="sm" 
            style={{ 
                backgroundColor: 'var(--mantine-color-body)',
                opacity: hovered ? 1 : 0.15,
                transition: 'opacity 0.3s',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            <Stack grow mb="md" bg="var(--mantine-color-body)">
                <Box>
                    <Flex direction="row" gap="sm">
                        <IconClock size={16} />
                        <Text size="sm" mb="xs" ta="center" left>Delay</Text>
                    </Flex>
                    <Tooltip label={`${slideshowDelay / 1000} seconds`}>
                        <Slider
                            value={slideshowDelay}
                            onChange={setSlideshowDelay}
                            min={1000}
                            max={10000}
                            step={1000}
                            label={(value) => `${value / 1000}s`}
                        />
                    </Tooltip>
                </Box>
                <Box w="10em">
                    <Text size="sm" mb="xs" ta="center">Effect</Text>
                    <SegmentedControl
                        value={slideshowEffect}
                        onChange={setSlideshowEffect}
                        data={[
                            { label: 'Fade', value: 'fade' },
                            { label: 'Wipe', value: 'wipe' },
                        ]}
                        fullWidth
                    />
                </Box>
            </Stack>
        </Card>
    );
};

export default SlideshowControls;
