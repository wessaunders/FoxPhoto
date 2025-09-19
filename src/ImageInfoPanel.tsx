import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Group,
    NumberInput,
    Paper,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    Title,
    Tooltip
} from '@mantine/core';
import {
    IconEdit,
    IconCheck,
    IconX,
    IconRefresh,
    IconCamera,
    IconMapPin,
    IconCalendar,
    IconRuler,
    IconInfoSquare
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import useFoxPhotoStore from './store/store';

interface EditableFieldProps {
    label: string;
    value: any;
    field: string;
    icon?: React.ReactNode;
    type?: 'text' | 'number' | 'date';
    editable?: boolean;
}

const EditableField = ({ label, value, field, icon, type = 'text', editable = true }: EditableFieldProps) => {
    const {
        isEditing,
        editingField,
        pendingChanges,
        startEditing,
        stopEditing,
        updateField,
        saveChanges,
        discardChanges
    } = useFoxPhotoStore();

    const [localValue, setLocalValue] = useState(value);
    const isCurrentlyEditing = isEditing && editingField === field;
    const hasPendingChange = field in pendingChanges;

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleStartEdit = () => {
        if (editable) {
            startEditing(field);
            setLocalValue(pendingChanges[field] ?? value);
        }
    };

    const handleSave = async () => {
        updateField(field, localValue);
        await saveChanges();
    };

    const handleCancel = () => {
        setLocalValue(value);
        stopEditing();
        if (hasPendingChange) {
            discardChanges();
        }
    };

    const formatValue = (val: any) => {
        if (val === null || val === undefined) return 'N/A';
        if (type === 'date' && val) {
            return new Date(val).toLocaleString();
        }
        if (typeof val === 'number') {
            return val.toLocaleString();
        }
        return String(val);
    };

    return (
        <Paper p="xs" withBorder={hasPendingChange} style={{ overflow: 'hidden' }}>
            <Flex justify="space-between" align="center" wrap="wrap">
                <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                    {icon}
                    <Text
                        size="sm"
                        fw={500}
                        style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere'
                        }}
                    >
                        {label}
                    </Text>
                    {hasPendingChange && <Badge size="xs" color="yellow">Modified</Badge>}
                </Group>

                {editable && !isCurrentlyEditing && (
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={handleStartEdit}
                    >
                        <IconEdit size={14} />
                    </ActionIcon>
                )}
            </Flex>

            <Box mt="xs">
                {isCurrentlyEditing ? (
                    <Group gap="xs" style={{ width: '100%' }}>
                        {type === 'number' ? (
                            <NumberInput
                                value={localValue}
                                onChange={setLocalValue}
                                size="xs"
                                style={{ flex: 1, minWidth: 0 }}
                            />
                        ) : (
                            <TextInput
                                value={localValue || ''}
                                onChange={(e) => setLocalValue(e.target.value)}
                                size="xs"
                                style={{
                                    flex: 1,
                                    minWidth: 0
                                }}
                                styles={{
                                    input: {
                                        wordBreak: 'break-word',
                                        overflowWrap: 'anywhere'
                                    }
                                }}
                            />
                        )}
                        <ActionIcon size="sm" color="green" onClick={handleSave}>
                            <IconCheck size={14} />
                        </ActionIcon>
                        <ActionIcon size="sm" color="red" onClick={handleCancel}>
                            <IconX size={14} />
                        </ActionIcon>
                    </Group>
                ) : (
                    <Text
                        size="sm"
                        c="dimmed"
                        style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {formatValue(pendingChanges[field] ?? value)}
                    </Text>
                )}
            </Box>
        </Paper>
    );
};

const ImageInfoPanel = () => {
    const {
        isImageInfoOpen,
        selectedImageInfo,
        exifData,
        closeImageInfo,
        refreshExifData,
        pendingChanges,
        saveChanges,
        discardChanges
    } = useFoxPhotoStore();

    if (!isImageInfoOpen || !selectedImageInfo) {
        return null;
    }

    const hasPendingChanges = Object.keys(pendingChanges).length > 0;

    const basicInfo = [
        { label: 'File Name', value: selectedImageInfo.name, field: 'name', icon: <IconInfoSquare size={16} />, editable: false },
        { label: 'File Path', value: selectedImageInfo.path, field: 'path', icon: <IconInfoSquare size={16} />, editable: false },
        { label: 'Width', value: selectedImageInfo.width, field: 'width', icon: <IconRuler size={16} />, type: 'number' as const, editable: false },
        { label: 'Height', value: selectedImageInfo.height, field: 'height', icon: <IconRuler size={16} />, type: 'number' as const, editable: false },
        { label: 'Last Modified', value: selectedImageInfo.mtime, field: 'mtime', icon: <IconCalendar size={16} />, type: 'date' as const, editable: false }
    ];

    const cameraInfo = exifData ? [
        { label: 'Camera Make', value: exifData.Make, field: 'Make', icon: <IconCamera size={16} /> },
        { label: 'Camera Model', value: exifData.Model, field: 'Model', icon: <IconCamera size={16} /> },
        { label: 'Date Taken', value: exifData.DateTimeOriginal || exifData.DateTime, field: 'DateTimeOriginal', icon: <IconCalendar size={16} />, type: 'date' as const },
        { label: 'F-Number', value: exifData.FNumber, field: 'FNumber', icon: <IconCamera size={16} />, type: 'number' as const },
        { label: 'Exposure Time', value: exifData.ExposureTime, field: 'ExposureTime', icon: <IconCamera size={16} />, type: 'number' as const },
        { label: 'ISO', value: exifData.ISO, field: 'ISO', icon: <IconCamera size={16} />, type: 'number' as const },
        { label: 'Focal Length', value: exifData.FocalLength, field: 'FocalLength', icon: <IconCamera size={16} />, type: 'number' as const },
        { label: 'Software', value: exifData.Software, field: 'Software', icon: <IconInfoSquare size={16} /> },
        { label: 'Artist', value: exifData.Artist, field: 'Artist', icon: <IconInfoSquare size={16} /> },
        { label: 'Copyright', value: exifData.Copyright, field: 'Copyright', icon: <IconInfoSquare size={16} /> },
        { label: 'Description', value: exifData.ImageDescription, field: 'ImageDescription', icon: <IconInfoSquare size={16} /> }
    ] : [];

    const locationInfo = exifData?.GPS ? [
        { label: 'Latitude', value: exifData.GPS.GPSLatitude, field: 'GPS.GPSLatitude', icon: <IconMapPin size={16} />, type: 'number' as const },
        { label: 'Longitude', value: exifData.GPS.GPSLongitude, field: 'GPS.GPSLongitude', icon: <IconMapPin size={16} />, type: 'number' as const },
        { label: 'Altitude', value: exifData.GPS.GPSAltitude, field: 'GPS.GPSAltitude', icon: <IconMapPin size={16} />, type: 'number' as const }
    ] : [];

    return (
        <Card shadow="md" p={0} style={{ width: 350, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                    <Title order={4}>Image Information</Title>
                    <Group gap="xs">
                        <Tooltip label="Refresh EXIF data">
                            <ActionIcon variant="subtle" onClick={refreshExifData}>
                                <IconRefresh size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <ActionIcon variant="subtle" onClick={closeImageInfo}>
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Card.Section>

            <Box style={{ flex: 1, overflow: 'hidden' }}>
                <ScrollArea h="100%" p="md">
                    <Stack gap="md">
                        {/* Basic File Information */}
                        <Box>
                            <Title order={5} mb="xs">File Information</Title>
                            <Stack gap="xs">
                                {basicInfo.map((info) => (
                                    <EditableField
                                        key={info.field}
                                        label={info.label}
                                        value={info.value}
                                        field={info.field}
                                        icon={info.icon}
                                        type={info.type}
                                        editable={info.editable}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        {/* Camera Information */}
                        {cameraInfo.length > 0 && (
                            <>
                                <Divider />
                                <Box>
                                    <Title order={5} mb="xs">Camera Information</Title>
                                    <Stack gap="xs">
                                        {cameraInfo.map((info) => (
                                            <EditableField
                                                key={info.field}
                                                label={info.label}
                                                value={info.value}
                                                field={info.field}
                                                icon={info.icon}
                                                type={info.type}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            </>
                        )}

                        {/* Location Information */}
                        {locationInfo.length > 0 && (
                            <>
                                <Divider />
                                <Box>
                                    <Title order={5} mb="xs">Location Information</Title>
                                    <Stack gap="xs">
                                        {locationInfo.map((info) => (
                                            <EditableField
                                                key={info.field}
                                                label={info.label}
                                                value={info.value}
                                                field={info.field}
                                                icon={info.icon}
                                                type={info.type}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            </>
                        )}
                    </Stack>
                </ScrollArea>
            </Box>

            {/* Action Buttons - Always visible at bottom */}
            {hasPendingChanges && (
                <Card.Section withBorder inheritPadding py="xs" style={{ flexShrink: 0 }}>
                    <Group justify="center" gap="xs">
                        <Button
                            size="xs"
                            color="green"
                            onClick={saveChanges}
                        >
                            Save Changes
                        </Button>
                        <Button
                            size="xs"
                            variant="outline"
                            onClick={discardChanges}
                        >
                            Discard
                        </Button>
                    </Group>
                </Card.Section>
            )}
        </Card>
    );
};

export default ImageInfoPanel;