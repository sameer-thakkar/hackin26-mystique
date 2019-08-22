import React, { Component } from "react";
import Link from "next/link";

export default class Footer extends Component<any, any> {
  render() {
    const { logoUrl, disclaimer, footerAltText, hasTermsPage } = this.props;
    return (
      <div className="footer">
        <div className="footer-logo">
          <img src={logoUrl} alt={footerAltText} />
        </div>
        <div className="line-and-disclaimer">
          <hr className="footer-line" />
          <div className="disclaimer">
            <span className="disclaimer-text">{disclaimer}</span>
            {hasTermsPage === "Yes" ? (
              <Link href="/terms">
                <span className="terms-tab">Terms & Conditions</span>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}
