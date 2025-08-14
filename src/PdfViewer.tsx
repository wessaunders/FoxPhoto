import { useState, useEffect } from 'react';
import {
    Group,
    ActionIcon,
    Text,
    NumberInput,
    Select,
    Stack,
    ScrollArea,
    Image,
    Loader,
    Alert,
} from '@mantine/core';
import {
    IconChevronLeft,
    IconChevronRight,
    IconZoomIn,
    IconZoomOut,
    IconMaximize,
    IconX,
    IconArrowsDiagonal,
} from '@tabler/icons-react';
import { PdfRenderer, PdfInfo } from './utils/pdfUtils';
import useFoxPhotoStore from './store/store';
import { FileTypes } from './interfaces/ui';

const PdfViewer = () => {
    const { selectedImage, showFullSizeImage, setShowFullSizeImage } = useFoxPhotoStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
    const [pageImage, setPageImage] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scaleOptions = [
        { value: '0.5', label: '50%' },
        { value: '0.75', label: '75%' },
        { value: '1', label: '100%' },
        { value: '1.25', label: '125%' },
        { value: '1.5', label: '150%' },
        { value: '2', label: '200%' },
    ];

    useEffect(() => {
        if (selectedImage) {
            const loadPdfInfo = async () => {
                try {
                    if (selectedImage.path) {
                        const info = await PdfRenderer.getPdfInfo(selectedImage.path);
                        setPdfInfo(info);
                        setCurrentPage(1);
                        setScale(1);
                    }
                } catch (err) {
                    console.error('Error loading PDF info:', err);
                    setError('Failed to load PDF');
                }
            };

            loadPdfInfo();
        }
    }, [selectedImage]);

    useEffect(() => {
        if (pdfInfo && selectedImage && selectedImage.path) {
            setLoading(true);
            setError(null);

            (async () => {
                try {
                    if (selectedImage.path) {
                        const imageUrl = await PdfRenderer.renderPage(
                            selectedImage.path, 
                            currentPage, 
                            scale);
                        setPageImage(imageUrl);
                    }
                } catch (err) {
                    console.error('Error loading page:', err);
                    setError('Failed to load page');
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [pdfInfo, selectedImage, currentPage, scale]);

    const findClosestScaleOption = scaleOptions.reduce((prev, curr) =>
        Math.abs(parseFloat(curr.value) - scale) < Math.abs(parseFloat(prev.value) - scale) ? curr : prev
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (pdfInfo && currentPage < pdfInfo.pageCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleZoomIn = () => {
        setScale(Math.min(scale * 1.2, 3));
    };

    const handleZoomOut = () => {
        setScale(Math.max(scale / 1.2, 0.5));
    };



    return (
        <>
            {selectedImage &&
                selectedImage.type === FileTypes.PdfType && (
                    <Stack gap="md">
                        {/* Controls */}
                        <Group justify="space-between">
                            <Group>
                                <ActionIcon
                                    onClick={handlePreviousPage}
                                    disabled={currentPage <= 1}
                                    variant="filled"
                                >
                                    <IconChevronLeft size={16} />
                                </ActionIcon>

                                <NumberInput
                                    value={currentPage}
                                    onChange={(value) => {
                                        const page = Number(value);
                                        if (pdfInfo && page >= 1 && page <= pdfInfo.pageCount) {
                                            setCurrentPage(page);
                                        }
                                    }}
                                    min={1}
                                    max={pdfInfo?.pageCount || 1}
                                    size="sm"
                                    w={80}
                                />

                                <Text size="sm" c="dimmed">
                                    / {pdfInfo?.pageCount || 1}
                                </Text>

                                <ActionIcon
                                    onClick={handleNextPage}
                                    disabled={!pdfInfo || currentPage >= pdfInfo.pageCount}
                                    variant="filled"
                                >
                                    <IconChevronRight size={16} />
                                </ActionIcon>
                            </Group>

                            <Group>
                                <ActionIcon onClick={handleZoomOut} variant="subtle">
                                    <IconZoomOut size={16} />
                                </ActionIcon>

                                <Select
                                    data={scaleOptions}
                                    value={findClosestScaleOption.value}
                                    onChange={(value) => value && setScale(parseFloat(value))}
                                    size="sm"
                                    w={80}
                                />

                                <ActionIcon onClick={handleZoomIn} variant="subtle">
                                    <IconZoomIn size={16} />
                                </ActionIcon>
                            </Group>
                        </Group>

                        {/* PDF Content */}
                        <ScrollArea 
                            h={showFullSizeImage ? "90vh" : "70vh"} 
                            w="100%">
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                {loading && <Loader size="lg" />}
                                {error && (
                                    <Alert color="red" title="Error">
                                        {error}
                                    </Alert>
                                )}
                                {pageImage && !loading && (
                                    <Image
                                        src={pageImage}
                                        alt={`Page ${currentPage}`}
                                        fit="none"
                                    />
                                )}
                            </div>
                        </ScrollArea>

                        { !showFullSizeImage
                            && (<Group justify="flex-end">
                                <ActionIcon
                                    onClick={setShowFullSizeImage}>
                                    <IconArrowsDiagonal size={24} />
                                </ActionIcon>
                            </Group>)
                        }                       
                    </Stack>
                )
            }        
        </>        
    );
};

export default PdfViewer;