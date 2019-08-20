import React, { Component } from "react";

export default class Footer extends Component<any, any> {
  render() {
    const { logoUrl, disclaimer } = this.props;
    return (
      <footer className="extract-this ">
        <div className="f-logo">
          <div className="block-logo">
            <img
              src={logoUrl}
              style={{ width: "160px", filter: "brightness(0) invert(1)" }}
            />
          </div>
        </div>
        <hr className="white"></hr>
        <div className="footer-wrap wrapper">
          <div className="disclaimer">
            <span>{disclaimer}</span>
          </div>
          <div className="terms">
            <a href="/terms">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    );
  }
}
