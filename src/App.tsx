import { 
    Anchor,
    AppShell, 
    Box, 
    Breadcrumbs, 
    Flex,
    LoadingOverlay, 
    Paper,
} from '@mantine/core';
import { BreadcrumbItem } from './interfaces/ui';
import { useEffect, useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import AdvancedSearchModal from './AdvancedSeachModal';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import FileExplorer from './FileExplorer';
import FullImageView from './FullImageView';
import ImageView from './ImageView';
import PdfViewer from './PdfViewer';
import Slideshow from './Slideshow';
import ThumbnailGrid from './ThumbnailGrid';
import useFoxPhotoStore from './store/store';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

const App = () => {
    const { 
        advancedSearchOpen,
        currentPath,
        getRootDirs, 
        isSlideshowActive,
        keyboardShortcutsOpened,
        loadSettings,
        loadingState, 
        readDirectory, 
        showFullSizeImage,
        startingPath,
        toggleAdvancedSearch, 
        toggleKeyboardShortcuts
    } = useFoxPhotoStore();
    useKeyboardShortcuts({});
    useHotkeys([
        ['?', () => toggleKeyboardShortcuts],
        ['F1', () => toggleKeyboardShortcuts],
    ]);

    const [navbarClosed, setNavbarClosed] = useState(false);
    const [pdfViewerOpened, setPdfViewerOpened] = useState(false);
    const [currentPdfPath, setCurrentPdfPath] = useState<string | null>(null);
    const [currentPdfName, setCurrentPdfName] = useState<string | undefined>(undefined);

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

    const closePdfViewer = () => {
        setPdfViewerOpened(false);
        setCurrentPdfPath(null);
        setCurrentPdfName(undefined);
    };

    const openPdfViewer = (filePath: string, fileName: string) => {
        setCurrentPdfPath(filePath);
        setCurrentPdfName(fileName);
        setPdfViewerOpened(true);
    };

    return (
        <>
            <AppShell
                footer={{ height: 60 }}
                header={{ height: 60 }}
                navbar={{ 
                    width: 250, 
                    breakpoint: 'sm', 
                    collapsed: {
                        desktop: navbarClosed 
                    }
                }}
                padding="md">
                <AppShell.Header p="xs">
                    <AppHeader 
                        isNavbarClosed={navbarClosed}
                        onToggleAdvancedSearch={toggleAdvancedSearch}
                        onToggleNavbar={() => setNavbarClosed((open) => !open)}>
                    </AppHeader>
                </AppShell.Header>

                <AppShell.Navbar p="xs">
                    <FileExplorer />
                </AppShell.Navbar>

                <AppShell.Main 
                    style={{
                        overflowY: 'hidden',
                        maxHeight: '100vh'
                    }}>
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

                    <Paper 
                        p="md" 
                        shadow="sm" 
                        radius="md" 
                        h="100%"
                        style={{ 
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                        <LoadingOverlay visible={loadingState.isScanning} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

                        <Flex 
                            direction="row" 
                            gap="md" 
                            h="100%"
                            style={{ flex: 1, minHeight: 0 }}>
                            <Box h="100%" style={{ flex: 1, minWidth: 0 }}>
                                <ImageView />
                                <PdfViewer />
                            </Box>
                            <Box h="100%" style={{ flex: 1, minWidth: 0 }}>
                                <ThumbnailGrid />
                            </Box>
                        </Flex>
                    </Paper>
                </AppShell.Main>
                <AppShell.Footer p="xs">
                    <AppFooter />
                </AppShell.Footer>
            </AppShell>

            <AdvancedSearchModal opened={advancedSearchOpen} onClose={toggleAdvancedSearch} />
            <KeyboardShortcutsModal
                opened={keyboardShortcutsOpened}
                onClose={toggleKeyboardShortcuts}
            />
            {showFullSizeImage && <FullImageView />}
            {isSlideshowActive && <Slideshow />}
        </>
    );
}

export default App;
