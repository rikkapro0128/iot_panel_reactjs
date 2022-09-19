import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './app';

import 'rsuite/dist/rsuite.min.css';
import './index.css';
// import Theme from './theme';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from '@/store/index.js';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#16161a',
      paper: '#16161a'
    },
    primary: {
      light: '#757ce8',
      main: '#757ce8',
      dark: '#757ce8',
      contrastText: '#fff',
    },
    secondary: {
      light: '#2cb67d',
      main: '#f44336',
      dark: '#72757e',
      contrastText: '#000',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      < CssBaseline />
      <GlobalStyles styles={{ 
        '::-webkit-scrollbar': {
          width: '10px',
          height: '10px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.secondary.dark,
        },
        '::-webkit-scrollbar-thumb': {
          border: '2px solid transparent',
          backgroundClip: 'content-box',
          backgroundColor: theme.palette.secondary.light,
        },
      }} />
      <App />
      <Toaster />
    </ThemeProvider>
  </Provider>
  //{/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
