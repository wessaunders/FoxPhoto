import { 
    Anchor, 
    AppShell, 
    Box, 
    Breadcrumbs, 
    Flex,
    Group, 
    LoadingOverlay, 
    Paper,
    Stack
} from '@mantine/core';
import { BreadcrumbItem } from './interfaces/ui'; 
import { useEffect, useState } from 'react';
import AdvancedSearchModal from './AdvancedSeachModal';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import FileExplorer from './FileExplorer';
import FullImageView from './FullImageView';
import ImageView from './ImageView';
import Slideshow from './Slideshow';
import ThumbnailGrid from './ThumbnailGrid';
import useFoxPhotoStore from './store/store';

const App = () => {
    const { 
        currentPath, 
        getRootDirs, 
        isSlideshowActive,
        loadSettings,
        loadingState, 
        readDirectory, 
        showFullSizeImage,
        startingPath,
    } = useFoxPhotoStore();

    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
    const [navbarClosed, setNavbarClosed] = useState(false);

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
    const breadcrumbs: BreadcrumbItem[] = pathParts.map((part, index) => {
        const path = pathParts.slice(0, index + 1).join('/');
        return { title: part, href: path };
    });

    return (
        <>
            <AppShell
                footer={{ height: 48 }}
                header={{ height: 60 }}
                navbar={{ 
                    width: 300, 
                    breakpoint: 'sm', 
                    collapsed: {
                        desktop: navbarClosed 
                    }
                }}
                padding="md">
                <AppShell.Header p="xs">
                    <AppHeader 
                        isNavbarClosed={navbarClosed}
                        onOpenAdvancedSearch={() => setAdvancedSearchOpen(true)}
                        onToggleNavbar={() => setNavbarClosed((open) => !open)} />
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

                        <Flex direction="row" gap="md" h="100%">
                            <Box style={{ flex: 1, minWidth: 0 }}>
                                <ImageView />
                            </Box>
                            <Box style={{ flex: 1, minWidth: 0 }}>
                                <ThumbnailGrid />
                            </Box>
                        </Flex>

                    </Paper>
                </AppShell.Main>
                <AppShell.Footer p="xs">
                    <AppFooter />
                </AppShell.Footer>
            </AppShell>

            <AdvancedSearchModal opened={advancedSearchOpen} onClose={() => setAdvancedSearchOpen(false)} />
            {showFullSizeImage && <FullImageView />}
            {isSlideshowActive && <Slideshow />}
        </>
    );
}

export default App;
