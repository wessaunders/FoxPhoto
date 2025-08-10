import {
    ActionIcon,
    Burger,
    Button,
    Group,
    SegmentedControl,
    TextInput,
    ThemeIcon,
    Title,
    useMantineColorScheme
} from '@mantine/core';
import { IconArrowBackUp, IconHome, IconPlayerPlay, IconFilterSearch, IconSearch, IconMoon, IconSun, IconX } from '@tabler/icons-react';
import useFoxPhotoStore from './store/store';

interface AppHeaderProps {
    isNavbarClosed: boolean;
    onToggleNavbar: () => void;
    onOpenAdvancedSearch: () => void;
}

const AppHeader = (props: AppHeaderProps) => {
    const { isNavbarClosed, onToggleNavbar, onOpenAdvancedSearch } = props;
    const {
        clearSearchTerm,
        currentPath,
        images,
        readDirectory, 
        searchTerm,
        selectedImagesForSlideshow,
        setSearchTerm,
        setStartingPath,
        startSlideshow
    } = useFoxPhotoStore();

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const clearButton = searchTerm && (
        <ActionIcon
            variant="transparent"
            onClick={clearSearchTerm}
            aria-label="Clear search">
            <IconX size={16} />
        </ActionIcon>
    );

    const handleNavigateUp = () => {
        if (currentPath === '/') {
            return;
        }
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        readDirectory(parentPath || '/');
    };

    return (
        <Group justify="space-between" h="100%">
            <Group justify="space-evenly">
                <Burger
                    opened={isNavbarClosed}
                    aria-label="Toggle File Explorer"
                    onClick={onToggleNavbar}>
                </Burger>
                <Title order={1} size="h3">FoxPhoto</Title>
                <Group>
                    <ActionIcon
                        variant="filled"
                        onClick={() => setStartingPath(currentPath)}>
                        <IconHome size={16} />
                    </ActionIcon>
                    {currentPath !== '/' && (
                        <ActionIcon
                            variant="light" onClick={handleNavigateUp}>
                            <IconArrowBackUp size={24} />
                        </ActionIcon>
                    )}
                </Group>
            </Group>
            <Group>
                <TextInput
                    style={{ minWidth: '35vw' }}
                    placeholder="Search images"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.currentTarget.value)}
                    leftSection={<IconSearch size={16} />}
                    rightSection={clearButton}
                />
            </Group>
            <Group>
                <Button
                    variant="filled"
                    leftSection={<IconPlayerPlay size={16} />}
                    onClick={startSlideshow}
                    disabled={images.length === 0 && selectedImagesForSlideshow.length === 0}>
                    Slideshow
                </Button>

                <ActionIcon
                    variant="subtle"
                    onClick={onOpenAdvancedSearch}>
                    <IconFilterSearch size={20} />
                </ActionIcon>
            </Group>
            <Group>
                <SegmentedControl
                    value={colorScheme}
                    onChange={toggleColorScheme}
                    data={[
                        {
                            value: 'light',
                            label: (
                                <ThemeIcon variant="subtle">
                                    <IconMoon size={16} />
                                </ThemeIcon>
                            )
                        },
                        {
                            value: 'dark',
                            label: (
                                <ThemeIcon variant="subtle">
                                    <IconSun size={16} />
                                </ThemeIcon>
                            )
                        }
                    ]}
                >
                </SegmentedControl>
            </Group>
        </Group>            
    );
}

export default AppHeader;