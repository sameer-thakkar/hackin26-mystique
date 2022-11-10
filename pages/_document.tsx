// _document is only rendered on the server side and not on the client side
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { getLangUID } from 'utils/urlUtils';
import { RTL_LANGUAGE_CODES } from 'const/index';

import { getLangObject } from '../utils/helper';

class MystiqueDocument extends Document {
  static async getInitialProps(ctx) {
    const { asPath, query, req } = ctx;
    const sheet = new ServerStyleSheet();
    const { lang } = getLangUID(req, query);
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      let styleElements = (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      );
      return {
        ...initialProps,
        styles: styleElements,
        asPath,
        query,
        lang,
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    // @ts-ignore
    const { lang } = this.props;
    const textDirection = RTL_LANGUAGE_CODES.includes(getLangObject(lang)?.code)
      ? 'rtl'
      : 'ltr';

    return (
      <Html dir={textDirection}>
        <Head>
          <link
            rel="preload"
            href="https://use.typekit.net/rql1une.css"
            as="style"
          />
          <link rel="preconnect" href="https://images.prismic.io" />
          <link rel="preconnect" href="https://cdn-imgix.headout.com" />
          <link rel="stylesheet" href="https://use.typekit.net/rql1une.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            async
            defer
            type="text/javascript"
            src="https://static.cdn.prismic.io/prismic.js?repo=mystique&amp;new=true"
          ></script>
        </body>
      </Html>
    );
  }
}

export default MystiqueDocument;
