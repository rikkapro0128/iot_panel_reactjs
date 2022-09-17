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
      main: '#7f5af0',
      dark: '#7f5af08c',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  // components: {
  //   // Name of the component
  //   MuiListItemText: {
  //     styleOverrides: {
  //       // Name of the slot
  //       secondary: {
  //         // Some CSS
  //         color: '#ccc',
  //       },
  //     },
  //   },
  //   MuiOutlinedInput: {
  //     styleOverrides: {
  //       notchedOutline: {
  //         borderColor: 'rgb(78 78 78)',
  //         ":hover" : {
  //           borderColor: '#fff',
  //         }
  //       }
  //     }
  //   },
  //   MuiInputLabel: {
  //     styleOverrides: {
  //       formControl: {
  //         color: '#ccc',
  //       },
  //     }
  //   },
  //   MuiInputBase: {
  //     styleOverrides: {
  //       root: {
  //         formControl: {
  //           color: '#ccc',
  //         },
  //         input: {
  //           color: '#ccc',
  //           textAlign: 'center'
  //         },
  //         textarea: {
  //           color: '#ccc',
  //         }
  //       }
  //     }
  //   },
  //   MuiSelect: {
  //     styleOverrides: {
  //       select: {
  //         color: '#ccc',
  //       },
  //       icon: {
  //         color: '#ccc',
  //       },
  //       iconOutlined: {
  //         color: '#ccc',
  //       },
  //       iconOpen: {
  //         color: 'rgb(25, 118, 210)',
  //       },
  //       iconFilled: {
  //         color: 'rgb(25, 118, 210)',
  //       },
  //       iconStandard: {
  //         color: 'rgb(25, 118, 210)',
  //       },
  //     }
  //   },
  //   MuiPaper: {
  //     styleOverrides: {
  //       root: {
  //         background: '#1F1F1F',
  //         color: '#fff',
  //       }
  //     }
  //   },
  //   MuiMenuItem: {
  //     styleOverrides: {
  //       root: {
  //         '&:hover': {
  //           background: '#323232',
  //         }
  //       }
  //     }
  //   },
  //   MuiDivider: {
  //     styleOverrides: {
  //       root: {
  //         '&:before': {
  //           borderTopColor: '#5c5c5c'
  //         },
  //         '&:after': {
  //           borderTopColor: '#5c5c5c'
  //         },
  //       }
  //     }
  //   },
  //   MuiTextField: {
  //     styleOverrides: {
  //       root: {
  //         // text
  //         color: '#fff',
  //       }
  //     }
  //   },
  //   MuiDialogContentText: {
  //     styleOverrides: {
  //       root: {
  //         color: '#fff'
  //       }
  //     }
  //   }
  // },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      < CssBaseline />
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
