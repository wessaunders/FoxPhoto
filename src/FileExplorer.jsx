import { NavLink, Flex, Text, Paper, ScrollArea } from '@mantine/core';
import { IconFolder, IconDisc } from '@tabler/icons-react';
import useFoxPhotoStore from './store/store';

function FileExplorer() {
    const { directories, readDirectory, currentPath, rootDirs } = useFoxPhotoStore();

    return (
        <Paper shadow="sm" radius="md" p="xs" h="100%">
        <ScrollArea h="100%">
            {directories.length === 0 && (
                <Text p="xs" c="dimmed">No sub-folders found.</Text>
            )}
            {directories.map((dir) => {
                const isRoot = rootDirs.includes(dir.path);
                return (
                    <NavLink
                        key={dir.path}
                        label={isRoot ? dir.path : dir.name}
                        leftSection={isRoot ? <IconDisc size={16} /> : <IconFolder size={16} />}
                        active={dir.path === currentPath}
                        onClick={() => readDirectory(dir.path)}
                        variant="subtle"
                        radius="md"
                    />
                );
            })}
        </ScrollArea>
        </Paper>
    );
}

export default FileExplorer;
