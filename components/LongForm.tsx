import React, { Component } from 'react';
import sliceHandler from './Slices';

export default class LongForm extends Component<any, any> {
  render() {
    const { content, ...sliceProps } = this.props;
    return (
      <div className="long-form main-wrapper">
        {content.map((slice, index) => (
          <div
            key={index}
            className={`${
              slice.slice_type !== 'background' ? 'slice-wrapper' : ''
            } slice-block ${slice.slice_type}`}
          >
            {sliceHandler(slice, { sliceProps })}
          </div>
        ))}
        <style jsx global>
          {`
            .long-form {
              font-family: 'Graphik', 'Proxima Nova', 'Helvetica Neue',
                Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #545454;
            }
            .main-wrapper {
              margin: unset;
              padding: 0;
              max-width: unset;
            }
            .slice-wrapper {
              max-width: 1200px;
              padding: 0 5.46vw;
              margin: auto;
              width: 100%;
            }
            .long-form h1,
            .long-form h2,
            .long-form h3,
            .long-form h4,
            .long-form h5,
            .long-form h6 {
              color: #545454;
              line-height: 1.2;
            }
            .long-form {
              display: grid;
              grid-row-gap: 60px;
            }
            .long-form .slice-block img {
              width: 100%;
            }
            .long-form h2 {
              display: inline-block;
              color: #545454;
              font-size: 1.8rem;
              font-weight: 500;
            }
            .long-form h2::after {
              content: '';
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
              font-weight: 500;
              color: #545454;
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
              color: #ec1943;
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
