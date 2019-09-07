import React, { PureComponent } from "react";
import { RichText } from "prismic-reactjs";
import { shortCodeSerializer } from "../utils/shortCodes";
import Image from "./Image";

export default class RichTextBox extends PureComponent<any, any> {
  render() {
    return (
      <div className="feature-box-wrapper">
        {this.props.slices.map((block, index) => (
          <div className="feature-box">
            <div className="feature-box__image-wrapper">
              <img src={block.image_source.url} />
            </div>
            <div className="feature-box__text-wrapper">
              <RichText
                key={index}
                render={block.feature_description}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}
