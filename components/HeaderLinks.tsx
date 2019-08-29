import React, { Component } from "react";

export default class HeaderLinks extends Component<any, any> {
  render() {
    const { headerLinks, isMobile, parentComponent } = this.props;
    return (
      <div className={isMobile ? "dropdown header-links" : "header-links"}>
        <div className="header-links">
          {!(parentComponent === "TERMS") && (
            <a onClick={this.props.openGroupBookingModal}>
              Group Tickets (15+ PAX)
            </a>
          )}
          {headerLinks.map((link, index) => (
            <a
              target={link.link_url.target}
              href={link.link_url.url}
              key={index}
            >
              {link.link_heading}
            </a>
          ))}
        </div>
      </div>
    );
  }
}
