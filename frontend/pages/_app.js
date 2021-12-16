import { ApolloProvider } from "@apollo/client";
import { getSession, SessionProvider } from "next-auth/react";
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
import AppBarMenu2 from "../components/AppBarMenu2";

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const client = getApolloClient();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = useState("light");
  const theme = React.useMemo(() => createTheme(getDesignToken(mode)), [mode]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [home, setHome] = useState(false);

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

  const handleRouteChange = (url) => {
    console.log(url);
    if (url === "/") setHome(true);
    else setHome(false);
  };

  useEffect(() => {
    handleRouteChange(router.pathname);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <ApolloProvider client={client}>
      <SessionProvider session={pageProps?.session}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles />
            {!home && <AppBarMenu2 setMode={setMode} />}
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
