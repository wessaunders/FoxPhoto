import { useEffect } from 'react';
import { Paper, 
    AppShell, 
    Flex, 
    Group, 
    Text, 
    Breadcrumbs, 
    Anchor, 
    Button, 
    Box, 
    LoadingOverlay, 
    Title,
    useMantineColorScheme } from '@mantine/core';
import { IconArrowBackUp, IconPlayerPlay, IconPlayerPause, IconSun, IconMoon } from '@tabler/icons-react';
import useFoxPhotoStore from './store/store';
import FileExplorer from './FileExplorer';
import ThumbnailGrid from './ThumbnailGrid';
import FullImageView from './FullImageView';
import Slideshow from './Slideshow';

function App() {
    const { 
        currentPath, 
        getRootDirs, 
        images,
        isSlideshowActive,
        loadingState, 
        readDirectory, 
        selectedImage,
        selectedImagesForSlideshow,
        startingPath,
        startSlideshow
    } = useFoxPhotoStore();

    // Use Mantine's built-in color scheme hook
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    // Initial fetch for root directories on app load
    useEffect(() => {
        if (startingPath) {
            readDirectory(startingPath);
        } else {
            getRootDirs();
        }
    }, [getRootDirs, readDirectory, startingPath]);

    const pathParts = currentPath.split(/\/|\\/).filter(Boolean);
    const breadcrumbs = pathParts.map((part, index) => {
        const path = pathParts.slice(0, index + 1).join('/');
        return { title: part, href: path };
    });

    const handleNavigateUp = () => {
        if (currentPath === '/') return;
        
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        readDirectory(parentPath || '/');
    };

    const toggleIcon = colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />;

    return (
        <>
            <AppShell
                header={{ height: 60 }}
                navbar={{ width: 300, breakpoint: 'sm' }}
                padding="md">
                <AppShell.Header p="xs" style={{ borderBottom: 'none' }}>
                <Group justify="space-between" h="100%">
                    <Title order={1} size="h3">FoxPhoto</Title>
                    <Group>
                        {currentPath !== '/' && (
                            <Button variant="light" leftSection={<IconArrowBackUp size={16} />} onClick={handleNavigateUp}>
                                Back
                            </Button>
                        )}
                        <Button
                            variant="filled"
                            leftSection={<IconPlayerPlay size={16} />}
                            onClick={startSlideshow}
                            disabled={images.length === 0 && selectedImagesForSlideshow.length === 0}>
                            Slideshow
                        </Button>                        
                        <Button variant="subtle" onClick={toggleColorScheme} leftSection={toggleIcon}>
                            Toggle {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
                        </Button>
                    </Group>
                </Group>
                </AppShell.Header>

                <AppShell.Navbar p="xs">
                    <FileExplorer />
                </AppShell.Navbar>

                <AppShell.Main>
                    <Paper 
                        p="md" 
                        shadow="sm" 
                        radius="md" 
                        style={{ 
                            position: 'relative', 
                            minHeight: 'calc(100vh - 120px)'
                        }}>
                        <LoadingOverlay visible={loadingState.isScanning} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

                        <Flex direction="column" gap="md" h="100%">
                            {/* Breadcrumbs */}
                            {currentPath && (
                                <Breadcrumbs>
                                <Anchor href="#" onClick={() => readDirectory('/')}>Root</Anchor>
                                {breadcrumbs.map((item, index) => (
                                    <Anchor key={index} href="#" onClick={() => readDirectory(item.href)}>
                                        {item.title}
                                    </Anchor>
                                ))}
                                </Breadcrumbs>
                            )}
                            {/* Image Grid */}
                            <ThumbnailGrid />
                        </Flex>
                    </Paper>
                </AppShell.Main>
            </AppShell>
            {selectedImage && <FullImageView />}
            {isSlideshowActive && <Slideshow />}
        </>
    );
}

export default App;
