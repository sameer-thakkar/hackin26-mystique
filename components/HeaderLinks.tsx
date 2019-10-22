import React, { Component } from "react";
import classNames from "classnames";
import { IS_MOBILE } from "./../utils/helper";

export default class HeaderLinks extends Component<any, any> {
  render() {
    const {
      headerLinks,
      isMobile,
      parentComponent,
      showGroupBooking,
      dropdown
    } = this.props;
    return (
      <div
        className={classNames(
          { "dropdown header-links": isMobile },
          { "header-links": isMobile },
          { show: dropdown.hamburger }
        )}
      >
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
