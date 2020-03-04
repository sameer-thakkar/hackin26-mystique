import React from 'react';
import classNames from 'classnames';
import sliceHandler from '../Slices';
import { GRAPHIK } from '../../constants/ui-constants';
import Image from '../UI/Image';
import SocialLinks from '../SocialLinks';

const Footer = props => {
  const { logo, body, favicon, mb_name, isMobile } = props;
  const altText = logo.alt ? logo.alt : 'Footer Logo';

  return (
    <footer>
      <div className="main-wrapper">
        <div className="custom-footer">
          <div
            className={classNames('footer-wrapper', {
              'center-logo': body.length === 0,
            })}
          >
            <div className="logo">
              <div className="powered-by">{mb_name} by</div>
              <Image
                url="https://cdn-imgix-open.headout.com/sites/assets/headout-white.png"
                width="208"
                format="png"
                alt={altText}
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
            {isMobile ? <SocialLinks isMobile={isMobile} /> : null}
          </div>
        </div>
        <div className="footer-chin">
          <div className="copyrights">
            <img className="icon" src={favicon.url} alt={favicon.alt} />
            <span>© Copyright All rights reserved.</span>
          </div>
          {!isMobile ? <SocialLinks isMobile={isMobile} /> : null}
        </div>
      </div>
      <style global jsx>
        {`
          footer {
            background: #000;
            padding: 32px 0;
          }
          .custom-footer {
            background: #000;
            margin: auto;
            display: grid;
            align-items: center;
            grid-column-gap: 1em;
            grid-row-gap: 2em;
            grid-auto-flow: row;
            padding-bottom: 48px;
          }
          .logo {
            align-self: flex-start;
            display: grid;
            grid-row-gap: 8px;
          }
          .footer-wrapper {
            display: grid;
            grid-template-columns: 260px 67%;
          }
          .custom-footer .logo img {
            height: auto;
            width: 104px;
            align-self: flex-start;
            // filter: saturate(0) contrast(1) invert(1);
          }
          .columns {
            display: grid;
            grid-auto-flow: column;
            justify-content: space-between;
            grid-gap: 2em;
            font-family: ${GRAPHIK.FONT_STACK};
          }
          .copyrights {
            color: white;
            display: grid;
            justify-content: left;
            align-items: center;
            grid-template-columns: auto auto;
            grid-gap: 10px;
            font-family: ${GRAPHIK.FONT_STACK};
            font-size: 12px;
            line-height: 20px;
            text-align: left;
          }
          .copyrights a {
            color: #fff;
          }

          .copyrights .icon {
            height: 24px;
            width: 24px;
          }

          .copyrights .icon {
            filter: contrast(0) brightness(0) invert(1);
          }

          .center-logo {
            grid-template-columns: auto;
            justify-self: center;
          }

          .powered-by {
            font-family: ${GRAPHIK.FONT_STACK};
            font-size: 14px;
          }
          .col .links-card .title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 0;
          }
          .col .links-card .link-item {
            font-size: 14px;
            font-weight: 400;
          }

          .col .links-card {
            grid-row-gap: 24px;
          }

          .footer-chin {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-between;
            border-top: ${body.length > 0 || logo.url
              ? '1px solid #ffffff4d'
              : 'none'};
            padding-top: 26px;
            padding-bottom: 58px;
          }

          @media (max-width: 768px) {
            .custom-footer {
              grid-template-columns: unset;
              grid-row-gap: 30px;
              grid-row-gap: 1em;
              padding-bottom: 24px;
            }
            .footer-wrapper {
              grid-template-columns: auto;
              grid-row-gap: 64px;
            }

            .copyrights {
              grid-column: unset;
            }
            .footer-chin {
              padding-bottom: 40px;
              padding-top: 24px;
            }
            .columns {
              grid-auto-flow: unset;
              grid-template-columns: auto;
            }
            .col {
              justify-self: left;
            }
            .col .links-card .title {
              font-weight: 600;
            }
            .col .links-card .link-item {
              font-size: 14px;
            }
            .columns .col .links-card {
              place-items: unset;
              grid-row-gap: 16px;
            }
            .columns .link-list {
              grid-row-gap: 12px;
            }
            .custom-footer .logo img {
              width: auto;
              height: 18px;
            }
          }
        `}
      </style>
    </footer>
  );
};
Footer.defaultProps = {
  body: [],
};

export default Footer;
