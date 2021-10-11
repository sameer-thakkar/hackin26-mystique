import React, { useState } from 'react';
import styled from 'styled-components';
import Chevron from 'UI/Chevron';
import Conditional from 'components/common/Conditional';
import { GLOBE } from 'assets/SvgIcons';
import { FULL_LANGUAGE_MAP, THEMES } from 'const/index';
import { COLORS, SOLEIL } from 'const/ui-constants';

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
    /*
      this adds white space below the active text,
      increasing the hover area
    */
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
    color: ${COLORS.PURPS};
  }
  .lang {
    transform: translateY(-2px);
    white-space: nowrap;
  }
  .selected-tab {
    color: ${COLORS.PURPS};
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

const LanguageSelector = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    currentLanguage,
    isMobile,
    languages: availableLanguages,
    mbTheme,
    isAmp,
  } = props;
  const handleClick = () => {
    setShowDropdown((prevState) => !prevState);
  };
  const handleChange = (e) => {
    const selectedLang = e.target?.value;
    if (!selectedLang) return;
    window.location.href = selectedLang;
  };

  if (isMobile) {
    return (
      <StyledMobileSelect>
        <span>{currentLanguage}</span>
        <Conditional if={isAmp}>
          <select
            onChange={(e) => e.target.blur()}
            onBlur={handleChange}
            // @ts-ignore
            on="change:AMP.navigateTo(url=event.value)"
            role="button"
            tabIndex={0}
          >
            <option disabled selected>
              {FULL_LANGUAGE_MAP[currentLanguage].language}
            </option>
            {availableLanguages.map((doc, index) => {
              return (
                <option value={doc.url} key={index}>
                  {FULL_LANGUAGE_MAP[doc.lang].language}
                </option>
              );
            })}
          </select>
        </Conditional>
        <Conditional if={!isAmp}>
          <select onChange={(e) => e.target.blur()} onBlur={handleChange}>
            <option disabled selected>
              {FULL_LANGUAGE_MAP[currentLanguage].language}
            </option>
            {availableLanguages.map((doc, index) => {
              return (
                <option value={doc.url} key={index}>
                  {FULL_LANGUAGE_MAP[doc.lang].language}
                </option>
              );
            })}
          </select>
        </Conditional>
      </StyledMobileSelect>
    );
  }
  return (
    <StyledLanguageContainer onClick={handleClick}>
      <StyledLanguage>
        {mbTheme !== THEMES.MIN_BLUE ? GLOBE : null}
        {FULL_LANGUAGE_MAP[currentLanguage].language}
        <Conditional if={mbTheme === THEMES.MIN_BLUE}>
          <Chevron className="chevron" isActive={showDropdown} />
        </Conditional>
      </StyledLanguage>
      <div
        className={`language-dropdown ${
          showDropdown ? 'language-dropdown-active' : ''
        }`}
      >
        {availableLanguages.map((doc, index) => {
          return (
            <a
              key={index}
              className={currentLanguage == doc.lang ? 'selected-tab' : ''}
              href={doc.url}
            >
              <div className="language">
                <span className="lang">
                  {FULL_LANGUAGE_MAP[doc.lang].language}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </StyledLanguageContainer>
  );
};

export default LanguageSelector;
