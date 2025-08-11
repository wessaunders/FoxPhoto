import {
    Modal,
    Title,
    Table,
    Group,
    Text,
    Code,
    Stack,
    Divider,
} from '@mantine/core';
import { Fragment } from 'react';

interface KeyboardShortcutsModalProps {
    opened: boolean;
    onClose: () => void;
}

const shortcuts = {
    'Image Navigation': [
        { keys: ['←', '→'], description: 'Previous/Next image in full view or slideshow' },
        { keys: ['↑'], description: 'Go to parent directory' },
        { keys: ['Space'], description: 'Toggle full image view / Play/Pause slideshow' },
        { keys: ['Enter'], description: 'Open image in full view' },
        { keys: ['Escape'], description: 'Exit full view or slideshow' },
        { keys: ['F'], description: 'Toggle full image view' },
    ],
    'Slideshow': [
        { keys: ['S'], description: 'Start/Stop slideshow' },
        { keys: ['P'], description: 'Play/Pause slideshow' },
    ],
    'Search & Navigation': [
        { keys: ['Ctrl+F', 'Cmd+F'], description: 'Open advanced search' },
        { keys: ['Ctrl+Shift+F', 'Cmd+Shift+F'], description: 'Clear search' },
        { keys: ['F5', 'Ctrl+R', 'Cmd+R'], description: 'Refresh directory' },
    ],
    'Grid Navigation': [
        { keys: ['Home'], description: 'Select first image' },
        { keys: ['End'], description: 'Select last image' },
    ],
    'Application': [
        { keys: ['Ctrl+D', 'Cmd+D'], description: 'Toggle dark/light theme' },
        { keys: ['?', 'F1'], description: 'Show keyboard shortcuts' },
    ],
};

const KeyboardShortcutsModal = (props: KeyboardShortcutsModalProps) => {
    const { opened, onClose } = props;

    const renderShortcutKey = (key: string) => (
        <Code key={key} style={{ margin: '0 2px' }}>
            {key}
        </Code>
    );

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Title>Keyboard Shortcuts</Title>}
            size="lg"
            centered
        >
            <Stack gap="md">
                {Object.entries(shortcuts)
                    .map(([category, categoryShortcuts]) => (
                    <div key={category}>
                        <Title order={4} size="h5" mb="xs">
                            {category}
                        </Title>
                        <Table>
                            <Table.Tbody>
                                {categoryShortcuts.map((shortcut, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td width={200}>
                                            <Group gap="xs">
                                                {shortcut.keys.map((key, keyIndex) => (
                                                    <Fragment key={keyIndex}>
                                                        {keyIndex > 0 && <Text size="sm">or</Text>}
                                                        {renderShortcutKey(key)}
                                                    </Fragment>
                                                ))}
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{shortcut.description}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                        {category !== 'Application' && <Divider my="md" />}
                    </div>
                ))}
            </Stack>
        </Modal>
    );
};

export default KeyboardShortcutsModal;