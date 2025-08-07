import { Box, Group, SegmentedControl, Slider, Text, Card, Tooltip } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import useFoxPhotoStore from './store/store';

const SlideshowControls = () => {
    const {
        slideshowDelay,
        setSlideshowDelay,
        slideshowEffect,
        setSlideshowEffect,
    } = useFoxPhotoStore();

    return (
        <Card withBorder radius="md" p="md" shadow="sm" style={{ backgroundColor: 'var(--mantine-color-body)' }}>
            <Group grow mb="md">
                <Box>
                    <Text size="sm" mb="xs" ta="center">Delay</Text>
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
                <Box w="12em">
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
            </Group>
        </Card>
    );
};

export default SlideshowControls;
