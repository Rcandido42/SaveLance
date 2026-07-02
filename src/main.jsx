import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#151c2c',
          color: '#e2e8f0',
          border: '1px solid #222f47',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#00ff66', secondary: '#0b0f19' },
          duration: 3500,
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#0b0f19' },
          duration: 4000,
        },
      }}
    />
  </StrictMode>
);
