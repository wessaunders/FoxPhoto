import React, { useState, useEffect } from 'react';
import { Card, Image, Text, Badge, Group, Stack, ActionIcon } from '@mantine/core';
import { IconFile, IconFileText, IconEye } from '@tabler/icons-react';
import { PdfRenderer, PdfInfo } from './utils/pdfUtils';

interface PdfThumbnailProps {
    filePath: string;
    fileName: string;
    isSelected?: boolean;
    onClick?: () => void;
    onDoubleClick?: () => void;
    size?: number;
}

const PdfThumbnail = (props: PdfThumbnailProps) => {
    const { filePath, fileName, isSelected = false, onClick, onDoubleClick, size = 200 } = props;
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadPdfData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load PDF info
                const info = await PdfRenderer.getPdfInfo(filePath);
                if (isMounted) {
                    setPdfInfo(info);
                }

                // Generate thumbnail
                const thumbnail = await PdfRenderer.generateThumbnail(filePath, size);
                if (isMounted) {
                    setThumbnailUrl(thumbnail);
                }
            } catch (err) {
                console.error('Error loading PDF:', err);
                if (isMounted) {
                    setError('Failed to load PDF');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadPdfData();

        return () => {
            isMounted = false;
        };
    }, [filePath, size]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.();
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDoubleClick?.();
    };

    return (
        <Card
            shadow={isSelected ? "md" : "sm"}
            padding="xs"
            radius="md"
            withBorder
            style={{
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--mantine-color-blue-6)' : undefined,
                transform: isSelected ? 'scale(1.02)' : undefined,
                transition: 'all 0.2s ease',
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <Card.Section>
                <div
                    style={{
                        width: size,
                        height: size,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--mantine-color-gray-1)',
                        position: 'relative',
                    }}
                >
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <Stack align="center" gap={4}>
                            <IconFile size={48} color="var(--mantine-color-gray-6)" />
                            <Text size="xs" c="dimmed">Error</Text>
                        </Stack>
                    ) : thumbnailUrl ? (
                        <>
                            <Image
                                src={thumbnailUrl}
                                alt={fileName}
                                fit="contain"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                            <Badge
                                size="xs"
                                variant="filled"
                                style={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                }}
                            >
                                PDF
                            </Badge>
                        </>
                    ) : (
                        <Stack align="center" gap={4}>
                            <IconFileText size={48} color="var(--mantine-color-blue-6)" />
                            <Text size="xs" c="dimmed">PDF</Text>
                        </Stack>
                    )}
                </div>
            </Card.Section>

            <Stack gap={4} mt="xs">
                <Text size="xs" lineClamp={2} title={fileName}>
                    {fileName}
                </Text>
                {pdfInfo && (
                    <Group gap={4} justify="space-between">
                        <Text size="xs" c="dimmed">
                            {pdfInfo.pageCount} page{pdfInfo.pageCount !== 1 ? 's' : ''}
                        </Text>
                        <ActionIcon
                            size="xs"
                            variant="subtle"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDoubleClick?.();
                            }}
                        >
                            <IconEye size={12} />
                        </ActionIcon>
                    </Group>
                )}
            </Stack>
        </Card>
    );
};

export default PdfThumbnail;