import React, { Component } from 'react';
import classNames from 'classnames';
import LinkResolver from './LinkResolver';

export default class HeaderLinks extends Component<any, any> {
  render() {
    const {
      headerLinks,
      isMobile,
      parentComponent,
      showGroupBooking,
      dropdown,
    } = this.props;

    return (
      <div
        className={classNames(
          { 'dropdown header-links': isMobile },
          { 'header-links': isMobile },
          { show: dropdown.hamburger }
        )}
      >
        <div className="header-links">
          {headerLinks.map((link, index) => (
            <LinkResolver target="_blank" url={link.link_url.url} key={index}>
              {link.link_heading}
            </LinkResolver>
          ))}
          {parentComponent !== 'TERMS' && showGroupBooking && (
            <a onClick={this.props.openGroupBookingModal}>Group Tickets</a>
          )}
        </div>
      </div>
    );
  }
}
