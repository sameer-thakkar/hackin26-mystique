import React, { Component } from "react";
import LanguageSelector from "./LanguageSelector";
import HeaderLinks from "./HeaderLinks";
import Image from "./Image";

export default class CustomHeader extends Component<any, any> {
  hamburgerRef: any;
  constructor(props) {
    super(props);
    this.hamburgerRef = React.createRef();
  }

  hamburgerToggle = x => {
    x.classList.toggle("change");
    x.nextElementSibling.classList.toggle("show");
    x.nextElementSibling.lastChild.classList.remove("up");
  };
  render() {
    const {
      header_links: headerLinks,
      logo,
      isMobile,
      parentComponent
    } = this.props;

    let { url: logoUrl, alt: logoAltText } = logo;
    return (
      <div className="header-container">
        <div className="header-wrapper">
          <div className="header-logo">
            <img src={logoUrl} alt={logoAltText} />
          </div>
          <div className="header-links-lang-container">
            <div
              ref={this.hamburgerRef}
              className="hamburger"
              onClick={x => this.hamburgerToggle(this.hamburgerRef.current)}
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
            />
          </div>
        </div>
      </div>
    );
  }
}
