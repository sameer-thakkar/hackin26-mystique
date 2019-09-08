import React, { Component } from "react";
import { CONTENT_TYPES } from "../constants";
import CustomHeader from "./CustomHeader";
import { sliceHandler } from "./Slices";
import CustomFooter from "./CustomFooter";
import Masthead from "./Masthead";
import populateHead from "./common/meta";
// import Banner from "./Banner";
import { IS_MOBILE } from "../utils/helper";

export default class SubPage extends Component<any, any> {
  prettifyProps(props) {
    let body = props.data.body;
    let featured = props.featured;
    let footer;

    props.subs.forEach(sub => {
      switch (sub.type) {
        case CONTENT_TYPES.FOOTER:
          footer = sub;
          break;
      }
    });
    return {
      footer,
      body,
      featured,
      data: props.data
    };
  }
  render() {
    const {
      footer,
      data,
      data: { body, header_ref, microsite_document_ref },
      featured
    } = this.prettifyProps(this.props);

    const {
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      lang
    } = this.props;

    const contentPageHasOtherMetaTags = data.other_meta_tags.filter(
      ({ meta_tag }) => meta_tag
    );

    const headProps = {
      ...this.props.data,
      ...microsite_document_ref.data,
      other_meta_tags: contentPageHasOtherMetaTags
        ? this.props.data.other_meta_tags
        : microsite_document_ref.other_meta_tags
    };

    return (
      <div className="page-wrapper">
        {populateHead({
          ...headProps,
          datePublished,
          dateModified,
          lang
        })}
        <header>
          <CustomHeader
            isMobile={IS_MOBILE}
            {...header_ref.data}
            parentComponent="SubPage"
          />
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
