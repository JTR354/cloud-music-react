import React from 'react';
import ReactDOM from 'react-dom/client';
import VConsole from 'vconsole';

import App from './App.tsx';

new VConsole();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
