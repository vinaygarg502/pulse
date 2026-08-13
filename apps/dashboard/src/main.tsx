import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/reset.css';
import './app/styles/variables.css';
import './app/styles/globals.css';
import './app/styles/layout.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
