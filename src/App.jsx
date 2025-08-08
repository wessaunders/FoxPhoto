import { 
    ActionIcon,
    Anchor, 
    AppShell, 
    Breadcrumbs, 
    Button, 
    Flex, 
    Group, 
    LoadingOverlay, 
    Paper, 
    TextInput,
    Title,
    useMantineColorScheme } from '@mantine/core';
import { IconArrowBackUp, IconHome, IconMoon, IconPlayerPlay, IconSearch, IconSun, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import AdvancedSearchModal from './AdvancedSeachModal';
import FileExplorer from './FileExplorer';
import FullImageView from './FullImageView';
import Slideshow from './Slideshow';
import ThumbnailGrid from './ThumbnailGrid';
import useFoxPhotoStore from './store/store';

function App() {
    const { 
        clearSearchTerm,
        currentPath, 
        getRootDirs, 
        images,
        isSlideshowActive,
        loadSettings,
        loadingState, 
        readDirectory, 
        searchTerm,
        selectedImage,
        selectedImagesForSlideshow,
        setSearchTerm,
        setStartingPath,
        startingPath,
        startSlideshow
    } = useFoxPhotoStore();

    // Use Mantine's built-in color scheme hook
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

    const clearButton = searchTerm && (
        <ActionIcon
            variant="transparent"
            onClick={clearSearchTerm}
            aria-label="Clear search">
            <IconX size={16} />
        </ActionIcon>
    );

    const toggleIcon = colorScheme === 'dark' 
        ? <IconSun size={16} /> 
        : <IconMoon size={16} />;

    /** Initial load for settings and then directories */
    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    /** Initial fetch for root directories on app load */
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
        if (currentPath === '/') {
            return;
        }
        
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        readDirectory(parentPath || '/');
    };

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
                                leftSection={<IconHome size={16} />}
                                onClick={() => setStartingPath(currentPath)}>
                                Set Start Folder
                            </Button>                        
                            <Button
                                variant="filled"
                                leftSection={<IconPlayerPlay size={16} />}
                                onClick={startSlideshow}
                                disabled={images.length === 0 && selectedImagesForSlideshow.length === 0}>
                                Slideshow
                            </Button>   
                            <TextInput
                                placeholder="Search images"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                                leftSection={<IconSearch size={16} />}
                                rightSection={clearButton}
                            />
                            <Button
                                variant="outline"
                                onClick={() => setAdvancedSearchOpen(true)}>
                                Advanced Search
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
            <AdvancedSearchModal opened={advancedSearchOpen} onClose={() => setAdvancedSearchOpen(false)} />
            {selectedImage && <FullImageView />}
            {isSlideshowActive && <Slideshow />}
        </>
    );
}

export default App;
