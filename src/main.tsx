import { createTheme, MantineProvider } from '@mantine/core';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';

// Define a custom theme for Mantine with rounded corners
const theme = createTheme({
    primaryColor: 'teal',
    radius: {
        md: '8px',
    }  
});

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <App />
        </MantineProvider>
    </React.StrictMode>
);