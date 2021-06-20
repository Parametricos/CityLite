import React, {useEffect} from 'react';
// Modules
import {AppProps} from 'next/app';
import Head from 'next/head';
// MUI Core
import CssBaseline from '@material-ui/core/CssBaseline';

// Utils
import theme from '../utils/theme';

import {MuiThemeProvider} from "@material-ui/core";
import {ThemeProvider} from "styled-components";
import DateFnsUtils from "@date-io/dayjs";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";

const MyApp: React.FC<AppProps> = ({Component, pageProps}) => {

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
      <>
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" />
          <title>Energy.IFC</title>
        </Head>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={theme}>
              <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <Component {...pageProps} />
              </MuiThemeProvider>
            </ThemeProvider>
        </MuiPickersUtilsProvider>
      </>
  );
};

export default MyApp;