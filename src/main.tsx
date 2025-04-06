import ReactDOM from 'react-dom/client';
import { StrictMode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { App } from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback="">
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
