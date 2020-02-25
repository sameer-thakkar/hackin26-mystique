import React, { Component } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import sliceHandler from './Slices';
import { attachQueryParam } from '../utils/helper';

export default class CustomFooter extends Component<any, any> {
  render() {
    const { logo, terms, body } = this.props;
    const logoUrl = logo ? logo.url : '';
    const altText = logo ? logo.alt : 'logo';

    return (
      <div className="custom-footer">
        <div
          className={classNames('logo-wrapper', {
            'center-logo': body.length === 0,
          })}
        >
          <div className="logo">
            <img
              data-src={attachQueryParam(logoUrl, 'w=150')}
              alt={altText}
              className="lazyload"
            />
          </div>
          {body.length ? (
            <div className="columns">
              {body.map((slice, index) => (
                <div key={index} className="col">
                  {sliceHandler(slice)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="terms-line">
          {sliceHandler({ items: [{ text: terms }], slice_type: 'rich_text' })}
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
              grid-column-gap: 1em;
              grid-row-gap: 2em;
              grid-auto-flow: row;
            }
            .logo {
              align-self: flex-start;
            }
            .logo-wrapper {
              display: grid;
              grid-template-columns: 25% 75%;
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

            .center-logo {
              grid-template-columns: auto;
              justify-self: center;
            }

            @media (max-width: 768px) {
              .custom-footer {
                grid-template-columns: unset;
                grid-row-gap: 30px;
                justify-items: center;
                grid-row-gap: 1em;
                justify-content: center;
              }
              .logo {
                padding-bottom: 2em;
              }
              .logo-wrapper {
                display: grid;
                width: 200px;
                margin-left: 5%;
                grid-template-rows: max-content max-content max-content;
                grid-template-columns: auto;
                place-items: center;
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
