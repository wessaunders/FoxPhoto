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

    const handleDelayChange = (value) => {
        setSlideshowDelay(parseInt(value, 10));
    };

    const handleEffectChange = (value) => {
        setSlideshowEffect(value);
    };

    return (
        <Group>
            <Select
                leftSection={<IconClock size={16} />}
                placeholder="Delay"
                data={[
                    { value: '1000', label: '1 sec' },
                    { value: '3000', label: '3 sec' },
                    { value: '5000', label: '5 sec' },
                ]}
                value={slideshowDelay.toString()}
                onChange={handleDelayChange}
            />
            <Select
                placeholder="Effect"
                data={[
                    { value: 'fade', label: 'Fade' },
                    { value: 'wipe', label: 'Wipe' },
                ]}
                value={slideshowEffect}
                onChange={handleEffectChange}
            />
        </Group>        
        // <Card withBorder radius="md" p="md" shadow="sm" style={{ backgroundColor: 'var(--mantine-color-body)' }}>
        //     <Group grow mb="md">
        //         <Box>
        //             <Text size="sm" mb="xs" ta="center">Delay</Text>
        //             <Tooltip label={`${slideshowDelay / 1000} seconds`}>
        //                 <Slider
        //                     value={slideshowDelay}
        //                     onChange={setSlideshowDelay}
        //                     min={1000}
        //                     max={10000}
        //                     step={1000}
        //                     label={(value) => `${value / 1000}s`}
        //                 />
        //             </Tooltip>
        //         </Box>
        //         <Box w="12em">
        //             <Text size="sm" mb="xs" ta="center">Effect</Text>
        //             <SegmentedControl
        //                 value={slideshowEffect}
        //                 onChange={setSlideshowEffect}
        //                 data={[
        //                     { label: 'Fade', value: 'fade' },
        //                     { label: 'Wipe', value: 'wipe' },
        //                 ]}
        //                 fullWidth
        //             />
        //         </Box>
        //     </Group>
        // </Card>
    );
};

export default SlideshowControls;
