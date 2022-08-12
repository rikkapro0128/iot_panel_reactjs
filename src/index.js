import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './app';

import 'rsuite/dist/rsuite.min.css';
import './index.css';
import Theme from './theme';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from '@/store/index.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Theme>
      <App />
      <Toaster />
    </Theme>
  </Provider>
  //{/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
