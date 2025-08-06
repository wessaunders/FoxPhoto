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

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <App />
        </MantineProvider>
    </React.StrictMode>
);