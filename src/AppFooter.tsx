import { ActionIcon, Group } from "@mantine/core"
import { IconList, IconMovie, IconPhoto, IconRotate2, IconRotateClockwise2, IconZoomIn } from "@tabler/icons-react";
import useFoxPhotoStore from './store/store';

const AppFooter = () => {
    const { rotateLeft, rotateRight } = useFoxPhotoStore();
    
    const toggleList = () => {
        //toggle between thumbnails or details
    }

    const togglePhotoFilter = () => {

    }

    const toggleThumbnailSize = () => {
        //toggle between set thumbnail sizes - 5 or 6 set sizes?
    }

    const toggleVideoFilter = () => {
        //filter by videos
    }

    return (
        <Group justify="space-between" h="100%">
            <Group>
                <ActionIcon
                    onClick={rotateLeft}
                    variant="subtle">
                    <IconRotate2 size={24}/>
                </ActionIcon>
                <ActionIcon
                    onClick={rotateRight}
                    variant="subtle">
                    <IconRotateClockwise2 size={24}/>
                </ActionIcon>
            </Group>
            <Group>
                <ActionIcon 
                    variant="subtle"
                    onClick={togglePhotoFilter}>
                    <IconPhoto size={24}/>
                </ActionIcon>
                <ActionIcon 
                    variant="subtle"
                    onClick={toggleVideoFilter}>
                    <IconMovie size={24}/>
                </ActionIcon>
                <ActionIcon
                    variant="subtle"
                    onClick={toggleList}>
                    <IconList size={24}/>
                </ActionIcon>
                <ActionIcon
                    variant="subtle"
                    onClick={toggleThumbnailSize}>
                    <IconZoomIn size={24}/>
                </ActionIcon>
            </Group>
        </Group>
    );
}

export default AppFooter;