import React, { Component, Fragment } from "react";
import LanguageSelector from "./LanguageSelector";
import HeaderLinks from "./HeaderLinks";
import classNames from "classnames";
import { POWERED_BY_HEADOUT_LOGO } from "../constants";
import { DROPDOWN_ELEMENT } from "../constants";
import PoweredByHeadout from "./PoweredByHeadout";

export default class Header extends Component<any, any> {
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
      languages,
      headerLinks,
      currentLanguage,
      logoUrl,
      logoAltText,
      availableLanguages,
      currentDomain,
      dropdown,
      handleDropdownToggle,
      isMobile,
      parentComponent,
      showGroupBooking,
      hasLanguageSelector,
      enableBuyTickets,
      logoRedirectionURL,
      host,
      hasPoweredByHeadoutLogo
    } = this.props;

    const hamburgerIconCheck = showGroupBooking || headerLinks.length;

    return (
      <div className="header-container">
        <div className="header-wrapper">
          <a href={logoRedirectionURL}>
            <div className="logo-wrapper">
              <img src={logoUrl} alt={logoAltText} />
              {hasPoweredByHeadoutLogo ? <PoweredByHeadout /> : null}
            </div>
          </a>
          <div
            className={classNames("header-links-lang-container", {
              addMargin: hamburgerIconCheck
            })}
          >
            {hamburgerIconCheck ? (
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
            ) : null}
            <HeaderLinks
              headerLinks={headerLinks}
              openGroupBookingModal={this.props.openGroupBookingModal}
              isMobile={isMobile}
              parentComponent={parentComponent}
              showGroupBooking={showGroupBooking}
              dropdown={dropdown}
              handleDropdownToggle={handleDropdownToggle}
            />
            {enableBuyTickets === "Yes" && (
              <div className="navbar-buy-tickets">
                <a href="#select-tickets">
                  <span className="nav-buy-tickets-text">Buy Tickets</span>
                </a>
              </div>
            )}
            {!(parentComponent === "TERMS") && hasLanguageSelector === "Yes" ? (
              <LanguageSelector
                languages={languages}
                availableLanguages={availableLanguages}
                currentLanguage={currentLanguage}
                currentDomain={currentDomain}
                dropdown={dropdown}
                handleDropdownToggle={handleDropdownToggle}
                host={host}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
