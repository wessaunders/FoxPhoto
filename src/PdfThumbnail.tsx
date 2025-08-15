import React, { useState, useEffect } from 'react';
import { Card, Image, Text, Badge, Group, Stack, ActionIcon, Flex, Box } from '@mantine/core';
import { IconFile, IconFileText, IconEye } from '@tabler/icons-react';
import { PdfRenderer, PdfInfo } from './utils/pdfUtils';
import useFoxPhotoStore from './store/store';

interface PdfThumbnailProps {
    filePath: string;
    fileName: string;
    isSelected?: boolean;
    size?: number;
}

const PdfThumbnail = (props: PdfThumbnailProps) => {
    const { 
        filePath, 
        fileName, 
        isSelected = false, 
        size = 200 
    } = props;
    const {
        selectImage,
    } = useFoxPhotoStore();    
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

    const handleClick = (filePath: string) => {
        selectImage(filePath);
    };


    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            onClick={() => handleClick(filePath)}>
            <Box style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                <Image
                    src={thumbnailUrl}
                    alt={fileName}
                    style={{ 
                        objectFit: 'cover', 
                        height: '100%', 
                        width: '100%' }}
                />
            </Box>
            <Text truncate mt="xs" size="sm" ta="center">{fileName}</Text>
        </Flex>
    );
};

export default PdfThumbnail;