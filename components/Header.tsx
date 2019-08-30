import React, { Component } from "react";
import LanguageSelector from "./LanguageSelector";
import HeaderLinks from "./HeaderLinks";
import Image from "./Image";
import Link from "next/link";

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
      slug,
      hasLanguageSelector
    } = this.props;
    const urlSlug = `/${slug}`;
    return (
      <div className="header-container">
        <div className="header-wrapper">
          <Link href={slug ? urlSlug : "/"}>
            <a>
              <div className="header-logo">
                {/* <img src={logoUrl} alt={logoAltText} /> */}
                <Image width={150} foramt="pjpg" url={logoUrl} />
              </div>
            </a>
          </Link>
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
              openGroupBookingModal={this.props.openGroupBookingModal}
              isMobile={isMobile}
              parentComponent={parentComponent}
            />
            {!(parentComponent === "TERMS") && (
              <LanguageSelector
                languages={languages}
                availableLanguages={availableLanguages}
                selectedLanguage={selectedLanguage}
                currentDomain={currentDomain}
                languageDropdown={languageDropdown}
                toggleDropdown={toggleDropdown}
                slug={slug}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
