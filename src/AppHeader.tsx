import {
    ActionIcon,
    Burger,
    Button,
    Group,
    SegmentedControl,
    TextInput,
    ThemeIcon,
    Title,
    Tooltip,
    useMantineColorScheme
} from '@mantine/core';
import { IconArrowBackUp, IconHome, IconPlayerPlay, IconFilterSearch, IconSearch, IconMoon, IconSun, IconX, IconQuestionMark } from '@tabler/icons-react';
import useFoxPhotoStore from './store/store';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

interface AppHeaderProps {
    isNavbarClosed: boolean;
    onToggleNavbar: () => void;
    onToggleAdvancedSearch: () => void;
}

const AppHeader = (props: AppHeaderProps) => {
    const { isNavbarClosed, onToggleNavbar, onToggleAdvancedSearch } = props;
    const {
        clearSearchTerm,
        currentPath,
        images,
        navigateToParent,
        readDirectory, 
        searchTerm,
        selectedImagesForSlideshow,
        setSearchTerm,
        setStartingPath,
        startSlideshow, 
        toggleKeyboardShortcuts,
    } = useFoxPhotoStore();

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    useKeyboardShortcuts({ toggleColorScheme });

    const clearButton = searchTerm && (
        <ActionIcon
            variant="transparent"
            onClick={clearSearchTerm}
            aria-label="Clear search">
            <IconX size={16} />
        </ActionIcon>
    );

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
                            variant="light" onClick={navigateToParent}>
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
                    onClick={onToggleAdvancedSearch}>
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
                <Tooltip label="Keyboard Shortcuts (?)">
                    <ActionIcon
                        variant="subtle"
                        onClick={toggleKeyboardShortcuts}>
                        <IconQuestionMark size={18} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Group>            
    );
}

export default AppHeader;