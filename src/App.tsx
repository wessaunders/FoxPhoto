import { 
    Anchor, 
    AppShell, 
    Breadcrumbs, 
    Flex, 
    LoadingOverlay, 
    Paper
} from '@mantine/core';
import { useEffect, useState } from 'react';
import AdvancedSearchModal from './AdvancedSeachModal';
import AppHeader from './AppHeader';
import FileExplorer from './FileExplorer';
import FullImageView from './FullImageView';
import Slideshow from './Slideshow';
import ThumbnailGrid from './ThumbnailGrid';
import useFoxPhotoStore from './store/store';

interface BreadcrumbItem {
    title: string;
    href: string;
}

const App = () => {
    const { 
        currentPath, 
        getRootDirs, 
        isSlideshowActive,
        loadSettings,
        loadingState, 
        readDirectory, 
        selectedImage,
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
                header={{ height: 60 }}
                navbar={{ 
                    width: 300, 
                    breakpoint: 'sm', 
                    collapsed: {
                        desktop: navbarClosed 
                    }
                }}
                padding="md">
                <AppShell.Header p="xs" style={{ borderBottom: 'none' }}>
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

                        <Flex direction="column" gap="md" h="100%">
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
