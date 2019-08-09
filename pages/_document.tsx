// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
import { apiEndpoint } from "../prismic-config";

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
            src="//static.cdn.prismic.io/prismic.min.js"
          />
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
