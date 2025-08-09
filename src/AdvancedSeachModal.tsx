import { Modal, Select, Group, Button, NumberInput } from '@mantine/core';
import useFoxPhotoStore from './store/store';

const IMAGE_TYPES = [
    { value: 'all', label: 'All' },
    { value: 'jpg', label: 'JPG' },
    { value: 'png', label: 'PNG' },
    { value: 'gif', label: 'GIF' },
    { value: 'bmp', label: 'BMP' },
    { value: 'webp', label: 'WEBP' },
];

const SORT_OPTIONS = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date Modified' },
    { value: 'resolution', label: 'Resolution' },
];

const ORDER_OPTIONS = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
];

interface AdvancedSearchModalProps {
    opened: boolean;
    onClose: () => void;
}

const AdvancedSearchModal = (props: AdvancedSearchModalProps) => {
    const { opened, onClose } = props;
    const { 
        advancedSearch, 
        setAdvancedSearch, 
        readDirectory, 
        currentPath } = useFoxPhotoStore();

    const handleApply = () => {
        readDirectory(currentPath);
        onClose();
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Advanced Search" centered>
            <Group direction="column" gap="md">
                <Select
                    label="Image Type"
                    data={IMAGE_TYPES}
                    value={advancedSearch.imageType}
                    onChange={value => setAdvancedSearch({ imageType: value })}
                />
                <Select
                    label="Sort By"
                    data={SORT_OPTIONS}
                    value={advancedSearch.sortBy}
                    onChange={value => setAdvancedSearch({ sortBy: value })}
                />
                <Select
                    label="Order"
                    data={ORDER_OPTIONS}
                    value={advancedSearch.sortOrder}
                    onChange={value => setAdvancedSearch({ sortOrder: value })}
                />
                <Group>
                    <NumberInput
                        label="Min Width"
                        value={advancedSearch.minResolution?.width || ''}
                        onChange={value => setAdvancedSearch({ minResolution: { ...advancedSearch.minResolution, width: value } })}
                        min={0}
                    />
                    <NumberInput
                        label="Min Height"
                        value={advancedSearch.minResolution?.height || ''}
                        onChange={value => setAdvancedSearch({ minResolution: { ...advancedSearch.minResolution, height: value } })}
                        min={0}
                    />
                </Group>
                <Button onClick={handleApply}>Apply</Button>
            </Group>
        </Modal>
    );
}

export default AdvancedSearchModal;