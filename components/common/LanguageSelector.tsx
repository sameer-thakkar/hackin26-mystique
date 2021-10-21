import React, { useState } from 'react';
import styled from 'styled-components';
import { strings } from 'const/strings';
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
    color: ${COLORS.GREY.G2};
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
    background-color: ${COLORS.WHITE};
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
  .language-dropdown {
    background: ${COLORS.WHITE};
    position: fixed;
    bottom: -2px;
    top: unset;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    width: 100%;
    text-align: center;
    border-radius: 4px;
  }
  .language,
  .close-btn {
    border-bottom: 1px solid ${COLORS.DADDY};
    padding: 16px 0;
  }
  .close-mask {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background: ${COLORS.BLACK};
    opacity: 0.5;
    z-index: 25;
  }
  .close-btn {
    color: ${COLORS.PURPS};
  }
  .hide {
    display: none;
  }
`;

const StyledLanguage = styled.span`
  margin-top: 7px;
  font-family: ${SOLEIL.FONT_STACK};
  font-size: 16px;
  color: ${COLORS.DAVY_GREY};
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

  if (isMobile) {
    return (
      <StyledMobileSelect isAmp={isAmp}>
        <span
          onClick={handleClick}
          role="button"
          tabIndex={0}
          // @ts-ignore
          on="tap:language-drop.toggleClass(class='hide'), overlay.toggleClass(class='hide')"
        >
          {currentLanguage}
        </span>
        <Conditional if={availableLanguages}>
          <div
            id="language-drop"
            className={`language-dropdown ${showDropdown ? '' : 'hide'}`}
          >
            {availableLanguages.map((doc, index) => {
              const { url, lang } = doc || {};
              return (
                <a key={index} href={url}>
                  <div className="language">
                    <span className="lang-option">
                      {FULL_LANGUAGE_MAP[lang].language}
                    </span>
                  </div>
                </a>
              );
            })}
            <div
              onClick={handleClick}
              className="close-btn"
              role="button"
              tabIndex={0}
              // @ts-ignore
              on="tap:language-drop.toggleClass(class='hide'), overlay.toggleClass(class='hide')"
            >
              {strings.CLOSE}
            </div>
          </div>
        </Conditional>
        <div
          onClick={handleClick}
          id="overlay"
          className={`close-mask ${showDropdown ? '' : 'hide'}`}
          role="button"
          tabIndex={0}
          // @ts-ignore
          on="tap:language-drop.toggleClass(class='hide'), overlay.toggleClass(class='hide')"
        ></div>
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
