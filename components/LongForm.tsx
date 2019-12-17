import React, { Component } from "react";
import { sliceHandler } from "./Slices";

export default class LongForm extends Component<any, any> {
  render() {
    const { content } = this.props;
    return (
      <div className="long-form select-wrapper">
        {content.map((slice, index) => (
          <div key={index} className="slice-block">
            {sliceHandler(slice)}
          </div>
        ))}
        <style jsx global>
          {`
            .long-form {
              font-family: "Graphik", "Proxima Nova", "Helvetica Neue",
                Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #545454;
            }
            .long-form h1,
            .long-form h2,
            .long-form h3,
            .long-form h4,
            .long-form h5,
            .long-form h6 {
              color: #333;
              line-height: 1.2;
              margin: 0 0 0.75em;
            }
            .long-form .slice-block {
              margin: 60px 0;
            }
            .long-form .slice-block img {
              width: 100%;
            }
            .long-form h2 {
              display: inline-block;
              color: #000;
              font-size: 1.8rem;
              font-weight: 500;
            }
            .long-form h2::after {
              content: "";
              width: 75px;
              display: block;
              height: 3px;
              background: #ec1943;
              margin-top: 20px;
            }
            .long-form h3 {
              font-size: 1.4rem;
              font-weight: 500;
            }
            /* Ignore immediate em,b,strong... inside h-tags */
            .long-form h1 > *,
            .long-form h2 > *,
            .long-form h3 > *,
            .long-form h4 > *,
            .long-form h5 > *,
            .long-form h6 > * {
              all: inherit;
            }
            .long-form p {
              font-size: 1rem;
              line-height: 1.8;
              color: #545454;
              text-align: justify;
              font-family: Avenir, Proxima-Nova, arial, sans-serif;
            }
            .long-form a {
              text-decoration: none;
              color: #000;
            }

            .long-form ul {
              font-size: 1rem;
              padding-left: 20px;
              line-height: 2;
            }

            @media (max-width: 768px) {
              .long-form h1 {
                font-size: 1.6rem;
              }
              .long-form h2 {
                font-size: 1.4rem;
              }
              .long-form h3 {
                font-size: 1.2rem;
              }
              .long-form h4 {
                font-size: 1rem;
              }
              .long-form h5 {
                font-size: 0.8rem;
              }
              .long-form h6 {
                font-size: 0.6rem;
              }

              .long-form p,
              .long-form ul {
                font-size: 0.8rem;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
