import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import './index.css';

import QueryClientProviderWrapper from './query/QueryClientProviderWrapper';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProviderWrapper>
        <App />
      </QueryClientProviderWrapper>
    </Provider>
  </React.StrictMode>
);
