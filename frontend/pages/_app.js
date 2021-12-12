import { ApolloProvider } from "@apollo/client";
import { getApolloClient } from "../data/apollo";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../lib/createEmotionCache";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import getDesignToken from "../lib/theme";
import GlobalStyles from "../lib/GlobalStyles";

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const client = getApolloClient();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = useState("light");

  const theme = React.useMemo(() => createTheme(getDesignToken(mode)), [mode]);

  return (
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <GlobalStyles />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}
