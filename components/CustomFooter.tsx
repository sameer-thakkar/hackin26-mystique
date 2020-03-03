import React, { Component } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import sliceHandler from './Slices';
import { attachQueryParam } from '../utils/helper';

const data = [
  {
    UID: 'www.colosseum-rome-tickets.com',
    Category: 'Colosseum',
    City: 'Rome',
  },
  {
    UID: 'www.versailles-palace-tickets.com',
    Category: 'Versailles',
    City: 'Paris',
  },
  { UID: 'www.eiffeltickets.com', Category: 'Eiffel Tower', City: 'Paris' },
  {
    UID: 'www.alcazar-seville-tickets.com',
    Category: 'Alcazar',
    City: 'Seville',
  },
  {
    UID: 'www.alhambra-granada-tickets.com',
    Category: 'Alhambra Granada',
    City: 'Granada',
  },
  {
    UID: 'www.borghesegallerytickets.com',
    Category: 'Borghese Gallery',
    City: 'Rome',
  },
  {
    UID: 'harry-potter.london-studio-tours.com',
    Category: 'Warner Bros. Studio',
    City: 'London',
  },
  { UID: 'www.accademia-tickets.com', Category: 'Accademia', City: 'Florence' },
  {
    UID: 'www.st-peters-basilica-tickets.com',
    Category: "St. Peter's Basilica",
    City: 'Rome',
  },
  {
    UID: 'www.doge-palace-tickets.com',
    Category: "Doge's Palace",
    City: 'Venice',
  },
  { UID: 'lido.cabaret-paris.com', Category: 'Paris Cabaret', City: 'Paris' },
  {
    UID: 'www.neuschwanstein-tours.com',
    Category: 'Neuschwanstein',
    City: 'Munich',
  },
];

export default class CustomFooter extends Component<any, any> {
  render() {
    const { uid, logo, terms, body } = this.props;
    const logoUrl = logo?.url ?? '';
    const altText = logo?.alt ?? 'logo';
    let block = '';
    data.forEach(item => {
      if (item.UID === uid) {
        block = `
       ${body[0].primary.heading} is an online website that is owned and operated by Headout which
            gives you the opportunity to buy guided tours and tickets to the
            ${item.Category} and other highlights in ${item.City}.`;
      }
    });

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
            <br />
            <div
              style={{
                fontFamily: 'Graphik',
                paddingRight: 10,
                fontSize: 14,
                lineHeight: 1.13,
              }}
            >
              {block}
            </div>
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
          <div style={{ textAlign: 'left', fontSize: 16 }}>
            {sliceHandler({
              items: [{ text: terms }],
              slice_type: 'rich_text',
            })}
          </div>
          <div className="terms-new">
            <div
              className="terms"
              style={{
                float: 'left',
                marginBottom: 10,
                fontSize: 16,
                marginTop: 20,
              }}
            >
              © 2020 Headout. All rights reserved.
            </div>
            <div style={{ display: 'flex' }}>
              <div className="terms-tab" style={{ marginRight: 8 }}>
                <Link href="/terms">Terms & Conditions</Link>
              </div>
              <Link href="/privacy-policy">
                <div className="terms-tab" style={{ marginRight: 8 }}>
                  Privacy Policy
                </div>
              </Link>
              <Link href="/company-details">
                <div className="terms-tab" style={{ marginRight: 8 }}>
                  Company Details
                </div>
              </Link>
            </div>
          </div>
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
