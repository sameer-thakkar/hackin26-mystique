import React, { Component } from "react";
import { IS_MOBILE } from "./../utils/helper";

export default class HeaderLinks extends Component<any, any> {
  render() {
    const {
      headerLinks,
      isMobile,
      parentComponent,
      showGroupBooking
    } = this.props;
    return (
      <div className={isMobile ? "dropdown header-links" : "header-links"}>
        <div className="header-links">
          {headerLinks.map((link, index) => (
            <a target="_blank" href={link.link_url.url} key={index}>
              {link.link_heading}
            </a>
          ))}
          {parentComponent !== "TERMS" && showGroupBooking && (
            <a onClick={this.props.openGroupBookingModal}>Group Tickets</a>
          )}
        </div>
      </div>
    );
  }
}
