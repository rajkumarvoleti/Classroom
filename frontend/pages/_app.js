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
import { useRouter } from "next/router";
import { AlertStateProvider } from "../lib/AlertContext";
import AlertComp from "../components/AlertComp";
import Page from "../components/Page";
import Head from "next/head";

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const client = getApolloClient();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = useState("light");
  const theme = React.useMemo(() => createTheme(getDesignToken(mode)), [mode]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", stopLoading);
    router.events.on("routeChangeError", stopLoading);
    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", stopLoading);
      router.events.off("routeChangeError", stopLoading);
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
          alt="icon"
        />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
          alt="icon"
        />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
          alt="icon"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ApolloProvider client={client}>
        <SessionProvider session={pageProps?.session}>
          <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
              <AlertStateProvider>
                <CssBaseline />
                <GlobalStyles />
                <Page setMode={setMode}>
                  <AlertComp />
                  <Component {...pageProps} />
                </Page>
              </AlertStateProvider>
            </ThemeProvider>
          </CacheProvider>
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}
