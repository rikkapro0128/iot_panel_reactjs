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

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    // Name of the component
    MuiListItemText: {
      styleOverrides: {
        // Name of the slot
        secondary: {
          // Some CSS
          color: '#ccc',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'rgb(78 78 78)',
          ":hover" : {
            borderColor: '#fff',
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        formControl: {
          color: '#ccc',
        },
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          formControl: {
            color: '#ccc',
          },
          input: {
            color: '#ccc',
            textAlign: 'center'
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: '#ccc',
        },
        icon: {
          color: '#ccc',
        },
        iconOutlined: {
          color: '#ccc',
        },
        iconOpen: {
          color: 'rgb(25, 118, 210)',
        },
        iconFilled: {
          color: 'rgb(25, 118, 210)',
        },
        iconStandard: {
          color: 'rgb(25, 118, 210)',
        },
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#1F1F1F',
          color: '#fff',
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: '#323232',
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          '&:before': {
            borderTopColor: '#5c5c5c'
          },
          '&:after': {
            borderTopColor: '#5c5c5c'
          },
        }
      }
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Theme>
      <ThemeProvider theme={theme}>
        <App />
        <Toaster />
      </ThemeProvider>
    </Theme>
  </Provider>
  //{/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
