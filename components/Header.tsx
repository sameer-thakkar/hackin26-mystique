import React, { Component } from "react";
import LanguageSelector from "./LanguageSelector";
import HeaderLinks from "./HeaderLinks";
import classNames from "classnames";

export default class Header extends Component<any, any> {
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
      languages,
      headerLinks,
      logoUrl,
      logoAltText,
      availableLanguages,
      selectedLanguage,
      currentDomain,
      languageDropdown,
      toggleDropdown,
      isMobile,
      parentComponent,
      showGroupBooking,
      hasLanguageSelector,
      enableBuyTickets,
      logoRedirectionURL
    } = this.props;
    const hamburgerIconCheck = showGroupBooking || headerLinks.length;
    return (
      <div className="header-container">
        <div className="header-wrapper">
          <a href={logoRedirectionURL}>
            <div className="header-logo">
              <img src={logoUrl} alt={logoAltText} />
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
                className="hamburger"
                onClick={x => this.hamburgerToggle(this.hamburgerRef.current)}
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
                selectedLanguage={selectedLanguage}
                currentDomain={currentDomain}
                languageDropdown={languageDropdown}
                toggleDropdown={toggleDropdown}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
