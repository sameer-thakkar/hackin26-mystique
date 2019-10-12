import React, { Component } from "react";
import Link from "next/link";
import { sliceHandler } from "./Slices";

export default class CustomFooter extends Component<any, any> {
  render() {
    const { logo, terms, body } = this.props;
    const logoUrl = logo ? logo.url : "";
    const altText = logo ? logo.alt : "";

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
          <Link href="/terms">
            <span className="terms-tab">Terms & Conditions</span>
          </Link>
        </div>
        <style jsx global>
          {`
            .custom-footer {
              max-width: 1190px;
              padding: 50px 50px 20px;
              margin: auto;
              display: grid;
              align-items: center;
              justify-content: space-between;
              grid-template-columns: 25% 75%;
              grid-column-gap: 1em;
              grid-row-gap: 2em;
            }
            .logo {
              align-self: flex-start;
            }
            .custom-footer .logo img {
              height: auto;
              width: 150px;
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
              font-size: 12px;
              text-align: center;
              padding-top: 20px;
              opacity: 0.6;
            }
            .terms-line a {
              color: #fff;
            }

            @media (max-width: 768px) {
              .custom-footer {
                grid-template-columns: unset;
                grid-row-gap: 30px;
                justify-items: center;
                grid-row-gap: 1em;
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
