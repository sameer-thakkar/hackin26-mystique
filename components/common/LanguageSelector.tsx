import React, { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { strings } from 'const/strings';
import Chevron from 'UI/Chevron';
import Conditional from 'components/common/Conditional';
import { GLOBE } from 'assets/SvgIcons';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  FULL_LANGUAGE_MAP,
  THEMES,
} from 'const/index';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { metaAtom } from 'store/atoms/meta';
import { useCaptureClickOutside } from 'hooks/ClickOutside';

const StyledLanguageContainer = styled.div`
  margin-left: 32px;
  position: relative;
  .language-dropdown a {
    text-decoration: none;
    color: ${COLORS.GRAY.G2};
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
  &.v2-selector {
    margin-left: 0;
    .language-dropdown {
      border-radius: 4px;
      z-index: 10;
      border: 1px solid #dadada;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
    }

    .language-selector-container {
      position: relative;
      margin-left: 30px;
    }

    .lang {
      padding-right: 20px;
      transform: translateY(-2px);
    }

    .language-selector-container {
      margin: 0;
    }
    .language-selector {
      line-height: 1;
    }
  }
  .language {
    display: flex;
    align-items: center;
    border-bottom: 0.5px dotted #d8d8d8;
    background-color: ${COLORS.BRAND.WHITE};
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
    ${expandFontToken('UI/Label Medium')}
    padding: 10px 25px;
    cursor: pointer;
  }
  .language-dropdown span {
    color: ${COLORS.GRAY.G2};
  }
  .language:hover {
    color: ${COLORS.BRAND.PURPS};
  }
  .lang {
    transform: translateY(-2px);
    white-space: nowrap;
  }
  .selected-tab {
    color: ${COLORS.BRAND.PURPS};
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
    ${expandFontToken('UI/Label Regular')}
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
    background: ${COLORS.BRAND.WHITE};
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
    border-bottom: 1px solid ${COLORS.GRAY.G6};
    padding: 16px 0;
  }
  .close-mask {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background: ${COLORS.BRAND.BLACK};
    opacity: 0.5;
    z-index: 25;
  }
  .close-btn {
    color: ${COLORS.BRAND.PURPS};
  }
  .hide {
    display: none;
  }
`;

const StyledLanguage = styled.span`
  margin-top: 7px;
  color: ${COLORS.GRAY.G2};
  ${expandFontToken('UI/Label Medium')}
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
    isV2 = false,
  } = props;
  const selectorRef = useRef(null);
  const parentRef = useRef(null);
  const exceptionElementRefs = [parentRef];
  const pageMetaData = useRecoilValue(metaAtom);
  const trackDropdownShown = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPDOWN_SHOWN,
      [ANALYTICS_PROPERTIES.HEADER]:
        FULL_LANGUAGE_MAP[currentLanguage].language,
      ...getCommonEventMetaData(pageMetaData),
    });
  };
  const handleClick = () => {
    setShowDropdown((prevState) => !prevState);
    if (!showDropdown) trackDropdownShown();
  };

  useCaptureClickOutside(
    selectorRef,
    () => {
      if (showDropdown) handleClick();
    },
    exceptionElementRefs
  );

  const trackLanguageChange = (newLanguage) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_LANGUGAGE_CHANGED,
      [ANALYTICS_PROPERTIES.LANGUAGE]: newLanguage,
    });
  };

  if (isMobile) {
    return (
      <StyledMobileSelect useRef={parentRef} isAmp={isAmp} isV2={isV2}>
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
                <a
                  key={index}
                  href={url}
                  onClick={() => trackLanguageChange(lang)}
                >
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
    <StyledLanguageContainer
      className={`${isV2 ? 'v2-selector' : ''}`}
      onClick={handleClick}
      onMouseEnter={trackDropdownShown}
      useRef={parentRef}
    >
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
        ref={selectorRef}
      >
        {availableLanguages.map((doc, index) => {
          return (
            <a
              key={index}
              className={currentLanguage == doc.lang ? 'selected-tab' : ''}
              href={doc.url}
              onClick={() => trackLanguageChange(doc.lang)}
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
