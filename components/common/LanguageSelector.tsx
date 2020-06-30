import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { withoutTrailingSlash } from 'utils/helper';
import { GLOBE } from 'assets/SvgIcons';
import { FULL_LANGUAGE_MAP } from 'constants/index';
import { COLORS, SOLEIL } from 'constants/ui-constants';

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
    font-family: ${SOLEIL.FONT_STACK};
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
  margin: 0;
  span {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    text-transform: uppercase;
    font-family: ${SOLEIL.FONT_STACK};
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
  font-family: ${SOLEIL.FONT_STACK};
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
        FULL_LANGUAGE_MAP[e.target.value].paramLang
      }`;
    } else {
      Router.push(`/${e.target.value}/${slug}`);
    }
  };

  render() {
    const { currentLanguage, host, uid, isMobile, languages } = this.props;
    const availableLanguages = languages.reduce((acc, item) => {
      const language = item.language.split('-')[1].toLowerCase();
      if (currentLanguage !== language) return [...acc, language];
      return acc;
    }, []);
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
            {availableLanguages.map((language, index) => {
              return (
                <option value={language} key={index}>
                  {FULL_LANGUAGE_MAP[language].language}
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
          {FULL_LANGUAGE_MAP[currentLanguage].language}
        </StyledLanguage>
        <div
          className={`language-dropdown ${
            this.state.showDropdown ? 'language-dropdown-active' : ''
          }`}
        >
          {isDev
            ? availableLanguages.map((language, index) => {
                return (
                  <a
                    className={
                      currentLanguage == language ? 'selected-tab' : ''
                    }
                    key={index}
                    href={`/?mystique_uid=${uid}&lang=${FULL_LANGUAGE_MAP[language].paramLang}`}
                  >
                    <div className="language">
                      <span className="lang">
                        {FULL_LANGUAGE_MAP[language].language}
                      </span>
                    </div>
                  </a>
                );
              })
            : availableLanguages.map((language, index) => {
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
                          {FULL_LANGUAGE_MAP[language].language}
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
