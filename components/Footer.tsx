import React, { Component } from 'react';
import Link from 'next/link';
import { attachQueryParam } from '../utils/helper';

export default class Footer extends Component<any, any> {
  render() {
    const { logoUrl, disclaimer, footerAltText, hasTermsPage } = this.props;
    return (
      <div className="footer">
        <div className="footer-logo">
          <img
            data-src={attachQueryParam(logoUrl, 'w=180')}
            alt={footerAltText}
            className="lazyload"
          />
        </div>
        <div className="line-and-disclaimer">
          <hr className="footer-line" />
          <div className="disclaimer">
            <span className="disclaimer-text">{disclaimer}</span>
            <Link href="/terms">
              <span className="" style={{ float: 'left' }}>
                © 2020 Headout. All rights reserved.
              </span>
              <span className="terms-tab">Terms & Conditions</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
