import { Button, Group, Modal, NumberInput, Select, Stack } from '@mantine/core';
import { IMAGE_TYPES, ORDER_OPTIONS, SORT_OPTIONS } from './constants/searchConstants';
import useFoxPhotoStore from './store/store';

interface AdvancedSearchModalProps {
    opened: boolean;
    onClose: () => void;
}

const AdvancedSearchModal = (props: AdvancedSearchModalProps) => {
    const { opened, onClose } = props;
    const { 
        advancedSearch, 
        currentPath,
        readDirectory, 
        setAdvancedSearch
    } = useFoxPhotoStore();

    const handleApply = () => {
        readDirectory(currentPath);
        onClose();
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Advanced Search" centered>
            <Stack gap="md">
                <Select
                    label="Image Type"
                    data={IMAGE_TYPES}
                    value={advancedSearch.imageType}
                    onChange={value => setAdvancedSearch({ imageType: value ?? undefined })}
                />
                <Select
                    label="Sort By"
                    data={SORT_OPTIONS}
                    value={advancedSearch.sortBy}
                    onChange={value => setAdvancedSearch({ sortBy: value as 'name' | 'date' | 'resolution' | undefined })}
                />
                <Select
                    label="Order"
                    data={ORDER_OPTIONS}
                    value={advancedSearch.sortOrder}
                    onChange={value => setAdvancedSearch({ sortOrder: value as 'asc' | 'desc' | undefined })}
                />
                <Group>
                    <NumberInput
                        label="Min Width"
                        value={advancedSearch.minResolution?.width || ''}
                        onChange={value => setAdvancedSearch({ 
                            minResolution: { 
                                width: typeof value === 'number' 
                                    ? value 
                                    : Number(value), 
                                height: advancedSearch.minResolution?.height ?? 0 
                            } 
                        })}
                        min={0}
                    />
                    <NumberInput
                        label="Min Height"
                        value={advancedSearch.minResolution?.height || ''}
                        onChange={value => setAdvancedSearch({ minResolution: { 
                            width: advancedSearch.minResolution?.width ?? 0, 
                            height: typeof value === 'number' 
                                ? value 
                                : Number(value) 
                            } 
                        })}
                        min={0}
                    />
                </Group>
                <Button onClick={handleApply}>Apply</Button>
            </Stack>
        </Modal>
    );
}

export default AdvancedSearchModal;