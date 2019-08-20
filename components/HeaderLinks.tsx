import React, { Component } from "react";

export default class HeaderLinks extends Component<any, any> {
  render() {
    const { headerLinks } = this.props;
    return (
      <div className="header-links">
        {headerLinks.map((link, index) => (
          <a target={link.link_url.target} href={link.link_url.url} key={index}>
            {link.link_heading}
          </a>
        ))}
      </div>
    );
  }
}
