import React, { Component } from "react";
import JSONTree from "react-json-tree";
import { CONTENT_TYPES } from "../constants";
import CustomHeader from "./CustomHeader";
import { sliceHandler } from "./Slices";
import CustomFooter from "./CustomFooter";
import Masthead from "./Masthead";
import Banner from "./Banner";
import { IS_MOBILE } from "../utils/helper";

export default class SubPage extends Component<any, any> {
  constructor(props) {
    super(props);
  }
  prettifyProps(props) {
    let body = props.body;
    let featured = props.featured;
    let footer, header;

    props.subs.forEach(sub => {
      switch (sub.type) {
        case CONTENT_TYPES.FOOTER:
          footer = sub;
          break;
        case CONTENT_TYPES.HEADER:
          header = sub;
          break;
      }
    });
    return {
      header,
      footer,
      body,
      featured
    };
  }
  render() {
    let { header, footer, body, featured } = this.prettifyProps(this.props);
    return (
      <div className="page-wrapper">
        <header>
          <CustomHeader {...header.data} parentComponent="SubPage" />
        </header>
        <main>
          <Masthead title={featured.title} image={featured.image.url} />
          <div className="subpage-container">
            {body.map((slice, index) => (
              <div key={index} className="slice-block">
                {sliceHandler(slice)}
              </div>
            ))}
          </div>
        </main>
        <footer>
          <CustomFooter {...footer.data} />
        </footer>
      </div>
    );
  }
}
