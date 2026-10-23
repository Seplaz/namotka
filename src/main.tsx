import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import './assets/fonts/fonts.css';
import './index.css';
import App from './App.tsx';
import { ToastProvider } from '@/components/ToastProvider/ToastProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
        <Analytics />
        <SpeedInsights />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
