import 'bootstrap/dist/css/bootstrap.min.css';

import './app/theme.css';
import './app/global.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from './app';
import { createAppStore } from './app/store.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={createAppStore()}>
      <App />
    </Provider>
  </React.StrictMode>,
);
