import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { withoutTrailingSlash } from '../../utils/helper';
import { GLOBE } from '../../public/static/svg-icons';
import { COLORS } from '../../constants/ui-constants';

const flagsUrl = {
  en: {
    language: 'English',
    paramLang: 'en-us',
  },
  it: {
    language: 'Italiano',
    paramLang: 'it-it',
  },
  es: {
    language: 'Español',
    paramLang: 'es-es',
  },
  fr: {
    language: 'Français',
    paramLang: 'fr-fr',
  },
  de: {
    language: 'Deutsch',
    paramLang: 'de-de',
  },
  nl: {
    language: 'Nederlands',
    paramLang: 'nl-nl',
  },
  pt: {
    language: 'Português',
    paramLang: 'pt-pt',
  },
};

const StyledLanguageContainer = styled.div`
  margin-left: 32px;
  position: relative;
  .language-dropdown a {
    text-decoration: none;
    color: #444444;
  }
  .language-dropdown {
    display: none;
    position: absolute;
    left: -25px;
    top: 20px;
  }
  .language {
    display: flex;
    align-items: center;
    border-bottom: 0.5px dotted #d8d8d8;
    background-color: rgba(255, 255, 255, 0.99);
    font-family: Avenir;
    font-size: 18px;
    padding: 10px 25px;
    cursor: pointer;
  }
  .language:hover {
    color: #ec1943;
  }
  .lang {
    transform: translateY(-2px);
  }
  .selected-tab {
    color: ${COLORS.RHAPSODY};
  }
  .language-dropdown-active {
    display: block;
  }
`;

const StyledMobileSelect = styled.div`
  position: relative;
  margin: 20px 15px 32px 0px;
  span {
    position: absolute;
    top: 0;
    left: 0;
    text-transform: uppercase;
    font-family: Graphik;
    font-size: 14px;
    color: #545454;
  }
  select {
    width: 20px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
`;

const StyledLanguage = styled.span`
  margin-top: 7px;
  font-family: Graphik;
  font-size: 16px;
  color: #545454;
  cursor: pointer;
  transform: translateY(-3px);
  svg {
    margin-right: 6px;
    margin-bottom: -2px;
  }
`;

class LanguageSelector extends Component<any, any> {
  state = {
    pathname: '',
    showDropdown: false,
  };

  componentDidMount() {
    this.setState({
      pathname: window.location.pathname,
    });
  }

  getLanguages = () => {
    const { currentLanguage, alternateLanguages, languages } = this.props;
    const prismicLanguages = languages.map((prismicLang) =>
      prismicLang.language.split('-')[1].toLowerCase()
    );
    const publishedLanguages = alternateLanguages.map(
      (publishLang) => publishLang.lang.split('-')[0]
    );
    publishedLanguages.push(currentLanguage);
    if (alternateLanguages.length > 0) {
      const liveLanguages = prismicLanguages.filter(
        (prismicLang) => publishedLanguages.indexOf(prismicLang) != -1
      );
      return liveLanguages;
    }
    return prismicLanguages;
  };

  handleClick = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  handleChange = (e) => {
    const { pathname } = this.state;
    const { uid, host } = this.props;
    const langCodeRegex = /^(\/){0,1}(en|fr|de|it|nl|pt|es)(\/){0,1}/;
    const removeLangFromPathname = pathname.replace(langCodeRegex, '');
    const slug = withoutTrailingSlash(removeLangFromPathname);
    const isDev = host.includes('localhost');
    if (isDev) {
      window.location.href = `http://${host}/?mystique_uid=${uid}&lang=${
        flagsUrl[e.target.value].paramLang
      }`;
    } else {
      Router.push(`/${e.target.value}/${slug}`);
    }
  };

  render() {
    const { currentLanguage, host, uid, isMobile } = this.props;
    const { pathname } = this.state;
    const langCodeRegex = /^(\/){0,1}(en|fr|de|it|nl|pt|es)(\/){0,1}/;
    const removeLangFromPathname = pathname.replace(langCodeRegex, '');
    const slugWithoutLeadingSlash = (slug) =>
      slug.charAt(slug[0]) === '/' ? slug.substr(1, slug.length) : slug;
    const slug = slugWithoutLeadingSlash(removeLangFromPathname);
    const isDev = host.includes('localhost');

    if (isMobile) {
      return (
        <StyledMobileSelect>
          <span>{currentLanguage}</span>
          <select
            value={currentLanguage}
            onChange={(e) => e.target.blur()}
            onBlur={this.handleChange}
          >
            {this.getLanguages().map((language, index) => {
              return (
                <option value={language} key={index}>
                  {flagsUrl[language].language}
                </option>
              );
            })}
          </select>
        </StyledMobileSelect>
      );
    }

    return (
      <StyledLanguageContainer onClick={this.handleClick}>
        <StyledLanguage>
          {GLOBE}
          {flagsUrl[currentLanguage].language}
        </StyledLanguage>
        <div
          className={`language-dropdown ${
            this.state.showDropdown ? 'language-dropdown-active' : ''
          }`}
        >
          {isDev
            ? this.getLanguages().map((language, index) => {
                return (
                  <a
                    className={
                      currentLanguage == language ? 'selected-tab' : ''
                    }
                    key={index}
                    href={`/?mystique_uid=${uid}&lang=${flagsUrl[language].paramLang}`}
                  >
                    <div className="language">
                      <span className="lang">
                        {flagsUrl[language].language}
                      </span>
                    </div>
                  </a>
                );
              })
            : this.getLanguages().map((language, index) => {
                return (
                  <Link key={index} href={`/${language}/${slug}`}>
                    <a
                      className={
                        currentLanguage == language ? 'selected-tab' : ''
                      }
                      href={`/${language}/${slug}`}
                    >
                      <div className="language">
                        <span className="lang">
                          {flagsUrl[language].language}
                        </span>
                      </div>
                    </a>
                  </Link>
                );
              })}
        </div>
      </StyledLanguageContainer>
    );
  }
}

export default LanguageSelector;
