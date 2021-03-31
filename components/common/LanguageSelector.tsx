import React, { Component } from 'react';
import styled from 'styled-components';
import { withoutTrailingSlash } from 'utils/helper';
import { GLOBE } from 'assets/SvgIcons';
import { FULL_LANGUAGE_MAP, THEMES, LANGUAGE_PARAMS_REGEX } from 'const/index';
import { COLORS, SOLEIL } from 'const/ui-constants';
import Chevron from 'UI/Chevron';

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
    left: 50%;
    transform: translateX(-50%);
    top: 50px;
  }
  &:after {
    // this adds white space below the active text,
    // increasing the hover area
    content: '';
    display: block;
    height: 30px;
    position: absolute;
    bottom: -30px;
    left: 0;
    width: 100%;
  }
  &:hover .language-dropdown {
    display: block;
  }
  .language {
    display: flex;
    align-items: center;
    border-bottom: 0.5px dotted #d8d8d8;
    background-color: ${({ theme }) => theme.primaryBackground};
    background-color: #fff;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    padding: 10px 25px;
    cursor: pointer;
  }
  .language-dropdown span {
    color: ${COLORS.FOUR_BLACK};
  }
  .language:hover {
    color: #ec1943;
  }
  .lang {
    transform: translateY(-2px);
    white-space: nowrap;
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
    text-transform: uppercase;
    padding: 4px; /* increase trigger area */
    padding-left: 12px;
    display: block;
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 14px;
    color: ${({ theme }) => theme.primaryBGText};
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
  ${({ theme }) =>
    theme.theme === THEMES.MIN_BLUE
      ? `
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 4px;
      align-items: center;
      .chevron {
        transform: scale(0.7);
      }
      .chevron::before,
      .chevron::after {
        background-color: ${theme.primaryBGText};
        width: 
      }
    `
      : ``}
  @media (max-width: 768px) {
    display: none;
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
    const selectedLang = e.target?.value;
    if (!selectedLang) return;
    const { pathname } = this.state;
    const { uid, host } = this.props;
    const langCodeRegex = /^(\/){0,1}(en|fr|de|it|nl|pt|es)(\/){0,1}/;
    const removeLangFromPathname = pathname.replace(langCodeRegex, '');
    let slug = withoutTrailingSlash(removeLangFromPathname);
    slug = slug[0] === '/' ? slug.slice(1) : slug;
    const isDev = host.includes('localhost');
    if (isDev) {
      window.location.href = `http://${host}/?mystique_uid=${uid}&lang=${FULL_LANGUAGE_MAP[selectedLang].paramLang}`;
    } else {
      window.location.href = `https://${host}/${selectedLang}/${slug}`;
    }
  };

  render() {
    const {
      currentLanguage,
      host,
      uid,
      isMobile,
      languages,
      mbTheme,
      isAmp,
    } = this.props;
    const availableLanguages = languages
      .filter(({ language }) => language?.length)
      .reduce((acc, item) => {
        const language = item.language.split('-')[1].toLowerCase();
        return [...acc, language];
      }, []);
    const { pathname } = this.state;
    const removeLangFromPathname = pathname.replace(LANGUAGE_PARAMS_REGEX, '');
    const slugWithoutLeadingSlash = (slug) =>
      slug.charAt(slug[0]) === '/' ? slug.substr(1, slug.length) : slug;
    const slug = slugWithoutLeadingSlash(removeLangFromPathname);
    const isDev = host.includes('localhost');

    if (isMobile) {
      return (
        <StyledMobileSelect>
          <span>{currentLanguage}</span>
          {isAmp ? (
            <select
              onChange={(e) => e.target.blur()}
              onBlur={this.handleChange}
              // @ts-ignore
              on="change:AMP.navigateTo(url=event.value)"
              role="button"
              tabIndex={0}
            >
              <option disabled selected>
                {FULL_LANGUAGE_MAP[currentLanguage].language}
              </option>
              {availableLanguages.map((language, index) => {
                return (
                  <option value={`http://${host}/${language}`} key={index}>
                    {FULL_LANGUAGE_MAP[language].language}
                  </option>
                );
              })}
            </select>
          ) : (
            <select
              onChange={(e) => e.target.blur()}
              onBlur={this.handleChange}
            >
              <option disabled selected>
                {FULL_LANGUAGE_MAP[currentLanguage].language}
              </option>
              {availableLanguages.map((language, index) => {
                return (
                  <option value={language} key={index}>
                    {FULL_LANGUAGE_MAP[language].language}
                  </option>
                );
              })}
            </select>
          )}
        </StyledMobileSelect>
      );
    }

    return (
      <StyledLanguageContainer onClick={this.handleClick}>
        <StyledLanguage>
          {mbTheme !== THEMES.MIN_BLUE ? GLOBE : null}
          {FULL_LANGUAGE_MAP[currentLanguage].language}
          {mbTheme === THEMES.MIN_BLUE ? (
            <Chevron className="chevron" isActive={this.state.showDropdown} />
          ) : null}
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
                  // <Link key={index} href={`/${language}/${slug}`}>
                  <a
                    key={index}
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
                  // </Link>
                );
              })}
        </div>
      </StyledLanguageContainer>
    );
  }
}

export default LanguageSelector;
