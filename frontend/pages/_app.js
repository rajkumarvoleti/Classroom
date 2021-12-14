import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { getApolloClient } from "../data/apollo";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../lib/createEmotionCache";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import getDesignToken from "../lib/theme";
import GlobalStyles from "../lib/GlobalStyles";
import Loading from "../components/Loading";

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const client = getApolloClient();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = useState("light");
  const theme = React.useMemo(() => createTheme(getDesignToken(mode)), [mode]);
  const [loading, setLoading] = useState(true);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    window.addEventListener("loadstart", startLoading);
    window.addEventListener("load", stopLoading);
    return () => {
      window.removeEventListener("loadstart", startLoading);
      window.removeEventListener("load", stopLoading);
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <ApolloProvider client={client}>
      <SessionProvider session={pageProps?.session}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <GlobalStyles />
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
