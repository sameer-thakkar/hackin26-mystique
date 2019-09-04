// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
import { apiEndpoint } from "../prismic-config";
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://a952d80706b3435388b1fb5983c74b18@sentry.io/1545593"
});

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  returnPrismic() {
    return `
      window.prismic = {
        endpoint: "${apiEndpoint}"
      };
    `;
  }

  render() {
    return (
      <Html>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: this.returnPrismic() }} />
          <script
            type="text/javascript"
            src="//static.cdn.prismic.io/prismic.min.js?new=true"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.0/css/swiper.min.css"
          />
          <link rel="stylesheet" href="../static/style.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
