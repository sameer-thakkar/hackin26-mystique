import React, { Component, Fragment } from "react";
import HeaderLinks from "./HeaderLinks";
import classNames from "classnames";
import PoweredByHeadout from "./PoweredByHeadout";
import { DROPDOWN_ELEMENT } from "../constants";
import { attachQueryParam } from "../utils/helper";

export default class CustomHeader extends Component<any, any> {
  hamburgerRef: any;
  constructor(props) {
    super(props);
    this.hamburgerRef = React.createRef();
  }
  hamburgerToggle = x => {
    this.props.handleDropdownToggle(DROPDOWN_ELEMENT.HAMBURGER);
  };

  render() {
    const {
      header_links: headerLinks,
      logo,
      isMobile,
      parentComponent,
      logoRedirectionURL,
      hasPoweredByHeadoutLogo,
      dropdown
    } = this.props;

    const logoUrl = logo ? logo.url : "";
    const logoAltText = logo ? logo.alt : "logo";

    return (
      <div className="header-container">
        <div className="header-wrapper">
          <a href={logoRedirectionURL}>
            <div className="header-logo-wrapper">
              <img
                className="lazyload"
                src={attachQueryParam(logoUrl, "h=40&q=10")}
                data-src={attachQueryParam(logoUrl, "h=40")}
                alt={logoAltText}
              />
              {hasPoweredByHeadoutLogo ? <PoweredByHeadout /> : null}
            </div>
          </a>
          <div className="header-links-lang-container">
            <div
              ref={this.hamburgerRef}
              className={classNames("hamburger", {
                change: dropdown.hamburger
              })}
              onClick={this.hamburgerToggle}
            >
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
            <HeaderLinks
              headerLinks={headerLinks}
              isMobile={isMobile}
              parentComponent={parentComponent}
              openGroupBookingModal={this.props.openGroupBookingModal}
              showGroupBooking={this.props.showGroupBooking}
              dropdown={this.props.dropdown}
              handleDropdownToggle={this.props.handleDropdownToggle}
            />
          </div>
        </div>
      </div>
    );
  }
}
