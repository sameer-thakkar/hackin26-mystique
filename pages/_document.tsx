// _document is only rendered on the server side and not on the client side
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import AMPAnalytics from 'components/common/AMPAnalytics';
import Conditional from 'components/common/Conditional';
import { getLangUID, isAmpUrl } from 'utils/urlUtils';
import { RTL_LANGUAGE_CODES } from 'const/index';

import ampFonts from '../style/amp/ampFonts';
import { getLangObject } from '../utils/helper';

class MystiqueDocument extends Document {
  static async getInitialProps(ctx) {
    const { asPath, query, req } = ctx;
    const sheet = new ServerStyleSheet();
    const { lang } = getLangUID(req, query);
    const originalRenderPage = ctx.renderPage;
    const isAmp = isAmpUrl(query);
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
      if (isAmp) {
        styleElements = (
          <>
            {initialProps.styles}
            <style
              dangerouslySetInnerHTML={{
                __html: ampFonts,
              }}
            />
            {JSON.parse(
              JSON.stringify(sheet.getStyleElement()).replace(
                /\s?!important/g,
                ''
              )
            )}
          </>
        );
      }
      return {
        ...initialProps,
        styles: styleElements,
        isAmp,
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
    const { isAmp, asPath, query, lang } = this.props;
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
          <AMPAnalytics asPath={asPath} query={query} />
          <Main />
          <NextScript />
          <Conditional if={!isAmp}>
            <script
              async
              defer
              type="text/javascript"
              src="https://static.cdn.prismic.io/prismic.js?repo=mystique&amp;new=true"
            ></script>
          </Conditional>
        </body>
      </Html>
    );
  }
}

export default MystiqueDocument;
