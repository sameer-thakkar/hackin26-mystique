// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://a952d80706b3435388b1fb5983c74b18@sentry.io/1545593"
});

class MystiqueDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
          <script
            type="text/javascript"
            defer
            src={`//static.cdn.prismic.io/prismic.min.js?repo=mystique&new=true`}
          />
        </body>
      </Html>
    );
  }
}

export default MystiqueDocument;
