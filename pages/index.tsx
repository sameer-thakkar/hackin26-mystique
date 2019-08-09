import React from "react";
import JSONTree from "react-json-tree";
import PrismicReact from "prismic-reactjs";
import {
  Client,
  apiEndpoint,
  hrefResolver,
  linkResolver
} from "../prismic-config";

export default class Page extends React.Component<any, any> {
  static async getInitialProps({ req }) {
    try {
      const data = await Page.getMicrositeData(req);
      if (process.browser) (window as any).prismic.setupEditButton();
      return { data };
    } catch (e) {
      console.log(e);

      return {};
    }
  }

  static async getMicrositeData(req) {
    try {
      const data = await Client(req).getByUID(
        "microsite",
        "www.tickets-amsterdam.com.madame-tussauds",
        { lang: "en-us" }
      );
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  render() {
    return (
      <div>
        <JSONTree data={this.props.data} invertTheme />
      </div>
    );
  }
}
