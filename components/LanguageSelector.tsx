import React, { Component } from "react";
import Link from "next/link";
import { DROPDOWN_ELEMENT } from "../constants";

const flagsUrl = {
  en: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1ec-1f1e7.svg",
    language: "English",
    paramLang: "en-us"
  },
  it: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1ee-1f1f9.svg",
    language: "Italiano",
    paramLang: "it-it"
  },
  es: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1ea-1f1f8.svg",
    language: "Español",
    paramLang: "es-es"
  },
  fr: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1eb-1f1f7.svg",
    language: "Français",
    paramLang: "fr-fr"
  },
  de: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1e9-1f1ea.svg",
    language: "Deutsch",
    paramLang: "de-de"
  },
  nl: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1f3-1f1f1.svg",
    language: "Nederlands",
    paramLang: "nl-nl"
  },
  pt: {
    flag: "https://s.w.org/images/core/emoji/12.0.0-1/svg/1f1f5-1f1f9.svg",
    language: "Português",
    paramLang: "pt-pt"
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
      arrowActive: false,
      pathname: ""
    };
  }

  componentDidMount() {
    this.setState({
      pathname: window.location.pathname
    });
  }

  getLanguages = () => {
    const { currentLanguage, availableLanguages, languages } = this.props;
    const prismicLanguages = languages.map(prismicLang =>
      prismicLang.language.split("-")[1].toLowerCase()
    );

    const publishedLanguages = availableLanguages.map(
      publishLang => publishLang.lang.split("-")[0]
    );
    publishedLanguages.push(currentLanguage);
    if (availableLanguages.length > 0) {
      const liveLanguages = prismicLanguages.filter(
        prismicLang => publishedLanguages.indexOf(prismicLang) != -1
      );
      return liveLanguages;
    }
    return prismicLanguages;
  };

  handleClick = () => {
    const { handleDropdownToggle } = this.props;
    handleDropdownToggle(DROPDOWN_ELEMENT.LANGUAGE_SELECTOR);
  };

  render() {
    const { currentLanguage, dropdown, host, uid } = this.props;
    const { pathname } = this.state;
    const slug = pathname
      .replace("en/", "")
      .replace("fr/", "")
      .replace("de/", "")
      .replace("it/", "")
      .replace("nl/", "")
      .replace("pt/", "")
      .replace("es/", "");

    const isDev = host.includes("localhost");

    return (
      <div onClick={this.handleClick} className="language-selector-container">
        <div className="language-selector">
          <div className="current-langauge">
            <div className="current-language-flag">
              <img src={flagsUrl[currentLanguage].flag} alt="flag" />
            </div>
            <span className="current-lang-code">{currentLanguage}</span>
          </div>
          <div
            ref={this.arrowRef}
            className={`arrow ${dropdown.lang ? "arrow-active" : ""}`}
          >
            ^
          </div>
        </div>
        <div
          ref={this.langDropdownRef}
          className={`language-dropdown ${
            dropdown.lang ? "language-dropdown-active" : ""
          }`}
        >
          {isDev
            ? this.getLanguages().map((language, index) => {
                return (
                  <a
                    className={
                      currentLanguage == language ? "selected-tab" : ""
                    }
                    key={index}
                    href={`/?mystique_uid=${uid}&lang=${flagsUrl[language].paramLang}`}
                  >
                    <div className="language">
                      <div className="language-flag">
                        <img
                          className="lazyload"
                          data-src={flagsUrl[language].flag}
                          alt="flag"
                        />
                      </div>
                      <span className="lang">
                        {flagsUrl[language].language}
                      </span>
                    </div>
                  </a>
                );
              })
            : this.getLanguages().map((language, index) => {
                return (
                  <Link key={index} href={`/${language}${slug}`}>
                    <a
                      className={
                        currentLanguage == language ? "selected-tab" : ""
                      }
                    >
                      <div className="language">
                        <div className="language-flag">
                          <img
                            data-src={flagsUrl[language].flag}
                            alt="flag"
                            className="lazyload"
                          />
                        </div>
                        <span className="lang">
                          {flagsUrl[language].language}
                        </span>
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
