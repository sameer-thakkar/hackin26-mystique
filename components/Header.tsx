import React, { Component } from "react";
import LanguageSelector from "./LanguageSelector";
import HeaderLinks from "./HeaderLinks";

export default class Header extends Component<any, any> {
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
      toggleDropdown
    } = this.props;
    return (
      <div className="header-container">
        <div className="header-logo">
          <img src={logoUrl} alt={logoAltText} />
        </div>
        <div className="header-links-lang-container">
          <HeaderLinks
            headerLinks={headerLinks}
            openGroupBookingModal={this.props.openGroupBookingModal}
          />
          <LanguageSelector
            languages={languages}
            availableLanguages={availableLanguages}
            selectedLanguage={selectedLanguage}
            currentDomain={currentDomain}
            languageDropdown={languageDropdown}
            toggleDropdown={toggleDropdown}
          />
        </div>
      </div>
    );
  }
}
