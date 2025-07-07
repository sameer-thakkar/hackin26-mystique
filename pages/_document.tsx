// _document is only rendered on the server side and not on the client side
import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { ServerStyleSheet } from 'styled-components';
import Conditional from 'components/common/Conditional';
import { InlineFontFace, PreloadFontLinks } from 'components/common/Font';
import { getLangObject } from 'utils/helper';
import { getLangUID } from 'utils/urlUtils';
import { RTL_LANGUAGE_CODES } from 'const/index';

class MystiqueDocument extends Document {
  static async getInitialProps(ctx: any) {
    const { asPath, query, req } = ctx;
    const sheet = new ServerStyleSheet();
    const { lang } = getLangUID(req, query);
    const originalRenderPage = ctx.renderPage;
    const isPreview = Object.keys(query).includes('previewSession');
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
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
        isPreview,
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    // @ts-expect-error TS(2339): Property 'lang' does not exist on type 'Readonly<R... Remove this comment to see the full error message
    const { lang, isPreview } = this.props;

    const textDirection = RTL_LANGUAGE_CODES.includes(getLangObject(lang)?.code)
      ? 'rtl'
      : 'ltr';

    return (
      <Html dir={textDirection} lang={getLangObject(lang)?.code}>
        <Head>
          {process.env.NEXT_PUBLIC_ENABLE_REACT_SCAN === 'true' && (
            <Script
              src="https://unpkg.com/react-scan/dist/auto.global.js"
              strategy="beforeInteractive"
            />
          )}
          <link rel="preconnect" href="https://images.prismic.io" />
          <link rel="preconnect" href="https://cdn-imgix.headout.com" />
          <PreloadFontLinks />
          <InlineFontFace />
          <Conditional if={lang === 'ar'}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600&display=swap"
              rel="stylesheet"
            />
          </Conditional>
        </Head>
        <body>
          <Main />
          <NextScript />
          <Conditional if={isPreview}>
            <Script
              id="prismic-script"
              strategy="afterInteractive"
              src="https://static.cdn.prismic.io/prismic.js?repo=mystique&amp;new=true"
            />
          </Conditional>
          <div
            id="itinerary-swipesheet-portal"
            style={{ position: 'relative', zIndex: 101 }} // z-index 101 is used to ensure that the itinerary swipesheet on-top of aside modal
          />
        </body>
      </Html>
    );
  }
}

export default MystiqueDocument;
