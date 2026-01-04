import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { RFQProvider } from './contexts/RFQContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RFQProvider>
      <App />
    </RFQProvider>
  </StrictMode>
);
