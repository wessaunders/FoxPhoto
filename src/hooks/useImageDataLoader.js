const useImageDataLoader = (imagePath) => {
    const [dataUrl, setDataUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            try {
                const url = await window.electronAPI.readImage(imagePath);
                if (isMounted) {
                    setDataUrl(url);
                }
            } catch (error) {
                console.error("Failed to load image:", imagePath, error);
                if (isMounted) {
                    setDataUrl(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        fetchImage();
        return () => {
            isMounted = false;
        };
    }, [imagePath]);

    return { dataUrl, isLoading };
};

export default useImageDataLoader;