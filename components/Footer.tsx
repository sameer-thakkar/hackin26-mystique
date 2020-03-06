import React, { Component } from 'react';
import { attachQueryParam } from '../utils/helper';

export default class Footer extends Component<any, any> {
  render() {
    const { logoUrl, disclaimer, footerAltText } = this.props;
    return (
      <div className="footer">
        <div className="footer-logo">
          <img
            data-src={attachQueryParam(logoUrl, 'w=180')}
            alt={footerAltText}
            className="lazyload"
          />
        </div>
        <hr className="footer-line" />
        <div className="footer-content-wrapper">
          <div className="disclaimer">{disclaimer}</div>
          <div className="legal-info">
            <div className="copyright-line">
              © 2020 Headout. All rights reserved.
            </div>
            <div className="legal-links">
              <a href={`/terms`}>Terms & Conditions</a>
              <a href={`/privacy-policy`}>Privacy Policy</a>
              <a href={`/company-details`}>Company Details</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
