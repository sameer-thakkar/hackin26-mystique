import React, { Component } from "react";
import Link from "next/link";

const flagsUrl = {
  en: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1ec-1f1e7.svg",
    language: "English"
  },
  it: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1ee-1f1f9.svg",
    language: "Italiano"
  },
  es: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1ea-1f1f8.svg",
    language: "Español"
  },
  fr: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1eb-1f1f7.svg",
    language: "Français"
  },
  de: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1e9-1f1ea.svg",
    language: "Deutsch"
  },
  nl: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1f3-1f1f1.svg",
    language: "Nederlands"
  },
  pt: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1f5-1f1f9.svg",
    language: "Português"
  }
};

export default class LanguageSelector extends Component<any, any> {
  langDropdownRef: any;
  arrowRef: any;

  constructor(props) {
    super(props);
    this.langDropdownRef = React.createRef();
    this.arrowRef = React.createRef();
    this.state = {
      arrowActive: false
    };
  }

  getAllLanguages = () => {
    const allLanguages = [];
    const { languages } = this.props;
    Object.keys(flagsUrl).map(langCode => {
      languages.map(lang => {
        if (lang.language.split("-")[1] == langCode.toUpperCase()) {
          const value = `${lang.language.split("-")[1]}`;
          allLanguages.push(value.toLowerCase());
        }
      });
    });
    return allLanguages;
  };

  getAvailableLanguages = () => {
    const liveLanguages = [];
    const { selectedLanguage, availableLanguages } = this.props;
    const selectedLangCode = selectedLanguage.substring(0, 2);
    Object.keys(flagsUrl).map(langCode => {
      availableLanguages.map(availLangCode => {
        if (
          langCode === selectedLangCode ||
          langCode === availLangCode.lang.substring(0, 2)
        ) {
          if (liveLanguages.indexOf(langCode) == -1) {
            liveLanguages.push(langCode);
          }
        }
      });
    });
    this.getAllLanguages();
    return liveLanguages;
  };

  handleClick = () => {
    const { toggleDropdown } = this.props;
    toggleDropdown();
  };

  render() {
    const {
      selectedLanguage,
      languageDropdown,
      availableLanguages,
      currentDomain
    } = this.props;
    const selectedLangCode = selectedLanguage.substring(0, 2);
    const ABslug = currentDomain.split(".");
    const slug = ABslug[ABslug.length - 1];

    return (
      <div onClick={this.handleClick} className="language-selector-container">
        <div className="language-selector">
          <div className="current-langauge">
            <div className="current-language-flag">
              <img src={flagsUrl[selectedLangCode].flag} alt="flag" />
            </div>
            <span className="current-lang-code">{selectedLangCode}</span>
          </div>
          <div
            ref={this.arrowRef}
            className={`arrow ${languageDropdown ? "arrow-active" : ""}`}
          >
            ^
          </div>
        </div>
        <div
          ref={this.langDropdownRef}
          className={`language-dropdown ${
            languageDropdown ? "language-dropdown-active" : ""
          }`}
        >
          {availableLanguages.length === 0 &&
            this.getAllLanguages().map((language, index) => {
              return (
                <Link key={index} href={`/${language}/${slug ? slug : ""}`}>
                  <a
                    className={
                      selectedLangCode == language ? "selected-tab" : ""
                    }
                  >
                    <div className="language">
                      <div className="language-flag">
                        <img src={flagsUrl[language].flag} alt="flag" />
                      </div>
                      <span className="lang">
                        {flagsUrl[language].language}
                      </span>
                    </div>
                  </a>
                </Link>
              );
            })}
          {this.getAvailableLanguages().map((language, index) => {
            return (
              <Link key={index} href={`/${language}/${slug ? slug : ""}`}>
                <a
                  className={selectedLangCode == language ? "selected-tab" : ""}
                >
                  <div className="language">
                    <div className="language-flag">
                      <img src={flagsUrl[language].flag} alt="flag" />
                    </div>
                    <span className="lang">{flagsUrl[language].language}</span>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
