import React, { Component } from "react";
import { RichText } from "prismic-reactjs";
import { shortCodeSerializer } from "../utils/shortCodes";

export default class LongForm extends Component<any, any> {
  render() {
    const { content } = this.props;
    return (
      <div className="long-form select-wrapper">
        {content.map(slice =>
          slice.items.map(block => (
            <RichText
              render={block.text}
              htmlSerializer={shortCodeSerializer}
            />
          ))
        )}
        <style jsx global>
          {`
            .long-form {
              font-family: "Graphik", "Proxima Nova", "Helvetica Neue",
                Helvetica, Arial, sans-serif;
              line-height: 1.6;
            }
            .long-form h2 {
              font-size: 2.2rem;
              display: inline-block;
            }
            .long-form h2::after {
              content: "";
              width: 50%;
              display: block;
              margin-top: 10px;
              height: 3px;
              background: #ec1943;
            }
            .long-form p {
              letter-spacing: 0.5px;
            }
          `}
        </style>
      </div>
    );
  }
}
