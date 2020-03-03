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
            <div
              style={{ textAlign: 'left', fontSize: 16, fontFamily: 'Graphik' }}
            >
              {disclaimer}
            </div>
            <div className="terms-new">
              <div
                className="terms"
                style={{
                  float: 'left',
                  marginBottom: 10,
                  fontSize: 16,
                  marginTop: 20,
                  fontFamily: 'Graphik',
                }}
              >
                © 2020 Headout. All rights reserved.
              </div>
              <div style={{ display: 'flex', marginBottom: 30 }}>
                <div className="terms-tab" style={{ marginRight: 8 }}>
                  <Link href="/terms">
                    <div className="terms-tab" style={{ marginRight: 8 }}>
                      Terms & Conditions
                    </div>
                  </Link>
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
        </div>
      </div>
    );
  }
}
