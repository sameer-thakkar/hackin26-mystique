// _document is only rendered on the server side and not on the client side
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://a952d80706b3435388b1fb5983c74b18@sentry.io/1545593',
});

class MystiqueDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
  window.prismic = {
    endpoint: 'https://mystique.cdn.prismic.io/api/v2'
  };`,
            }}
          />
          <script
            async
            type="text/javascript"
            src="https://static.cdn.prismic.io/prismic.min.js?new=true"
          />
        </body>
      </Html>
    );
  }
}

export default MystiqueDocument;
