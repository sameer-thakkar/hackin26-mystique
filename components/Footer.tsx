import React, { Component } from 'react';
import { attachQueryParam } from '../utils/helper';

export default class Footer extends Component<any, any> {
  render() {
    const { logoUrl, disclaimer, footerAltText, micrositeURL } = this.props;
    let url = micrositeURL;
    if (micrositeURL[micrositeURL.length - 1] === '/') {
      url = micrositeURL.slice(0, -1);
    }
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
              <a href={`${url}/terms`}>Terms & Conditions</a>
              <a href={`${url}/privacy-policy`}>Privacy Policy</a>
              <a href={`${url}/company-details`}>Company Details</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
