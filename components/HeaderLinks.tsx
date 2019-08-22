import React, { Component } from "react";
import { isMobile } from "react-device-detect";

export default class HeaderLinks extends Component<any, any> {
  render() {
    const { headerLinks, isMobile } = this.props;
    return (
      <div className={isMobile ? "dropdown header-links" : "header-links"}>
        {headerLinks.map((link, index) => (
          <a target={link.link_url.target} href={link.link_url.url} key={index}>
            {link.link_heading}
          </a>
        ))}
      </div>
    );
  }
}
