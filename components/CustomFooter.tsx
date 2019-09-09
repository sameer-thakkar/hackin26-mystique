import React, { Component } from "react";
import Link from "next/link";
import { sliceHandler } from "./Slices";

export default class CustomFooter extends Component<any, any> {
  render() {
    const { logo, terms, body } = this.props;
    const { url: logoUrl, alt: altText } = logo;

    return (
      <div className="custom-footer">
        <div className="logo">
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
              padding: 50px;
              margin: auto;
              display: grid;
              align-items: center;
              justify-content: space-between;
              grid-template-columns: 25% 75%;
              grid-column-gap: 1em;
            }
            .logo {
              align-self: flex-start;
            }
            .custom-footer .logo img {
              height: auto;
              width: 150px;
              filter: invert(1);
              align-self: flex-start;
            }
            .columns {
              display: grid;
              grid-auto-flow: column;
              justify-content: space-between;
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
                grid-row-gap: 30px;
                justify-content: center;
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
