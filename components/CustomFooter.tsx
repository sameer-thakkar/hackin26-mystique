import React, { Component } from "react";
import Link from "next/link";
import { sliceHandler } from "./Slices";

export default class CustomFooter extends Component<any, any> {
  render() {
    const { logo, terms, body } = this.props;
    const { url: logoUrl, alt: altText } = logo;

    return (
      <div className="custom-footer">
        <div className="custom-footer logo">
          <img src={logoUrl} alt={altText} />
        </div>
        <div className="columns">
          {body.map((slice, index) => (
            <div key={index} className="col">
              {sliceHandler(slice)}
            </div>
          ))}
        </div>
        <div className="terms-line">
          {sliceHandler({ items: [{ text: terms }], slice_type: "rich_text" })}
        </div>
        <style jsx global>
          {`
            .custom-footer {
              max-width: 1190px;
              min-height: 250px;
              margin: auto;
              display: grid;
              align-items: center;
              justify-content: space-between;
              grid-template-columns: max-content max-content;
              grid-column-gap: 1em;
            }
            .custom-footer.logo img {
              height: 10em;
              width: auto;
            }
            .columns {
              display: grid;
              grid-auto-flow: column;
              grid-auto-columns: 1fr;
              grid-gap: 2em;
            }
            .terms-line {
              grid-column: 1 / 3;
              color: white;
              font-family: Avenir;
              font-size: 10px;
              text-align: center;
              padding-bottom: 10px;
            }
            .terms-line a {
              color: #fff;
            }

            @media (max-width: 768px) {
              .custom-footer {
                grid-template-columns: unset;
              }
              .terms-line {
                grid-column: unset;
              }
              .columns {
                grid-auto-flow: unset;
              }
              .col {
                justify-self: center;
                text-align: center;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
