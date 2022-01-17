import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "../lib/createEmotionCache";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { getApolloClient } from "../data/apollo.js";
import theme from "../lib/theme";

class DocumentWithApollo extends Document {
  constructor(props) {
    super(props);

    /**
     * Attach apolloState to the "global" __NEXT_DATA__ so we can populate the ApolloClient cache
     */
    const { __NEXT_DATA__, apolloState } = props;
    __NEXT_DATA__.apolloState = apolloState;
  }

  static async getInitialProps(ctx) {
    console.clear();

    const startTime = Date.now();

    const originalRenderPage = ctx.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} {...props} />;
          },
      });

    /**
     * Initialize and get a reference to ApolloClient, which is saved in a "global" variable.
     * The same client instance is returned to any other call to `getApolloClient`, so _app.js gets the same authenticated client to give to ApolloProvider.
     */
    const apolloClient = getApolloClient(true);

    /**
     * Render the page through Apollo's `getDataFromTree` so the cache is populated.
     * Unfortunately this renders the page twice per request... There may be a way around doing this, but I haven't quite ironed that out yet.
     */
    await getDataFromTree(<ctx.AppTree {...ctx.appProps} />);

    /**
     * Render the page as normal, but now that ApolloClient is initialized and the cache is full, each query will actually work.
     */
    const initialProps = await Document.getInitialProps(ctx);

    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    /**
     * Extract the cache to pass along to the client so the queries are "hydrated" and don't need to actually request the data again!
     */
    const apolloState = apolloClient.extract();

    console.info(`Render Time: ${Date.now() - startTime} milliseconds.`);

    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        ...emotionStyleTags,
      ],
      apolloState,
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default DocumentWithApollo;
