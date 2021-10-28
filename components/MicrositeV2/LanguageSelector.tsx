import React, { useRef, useContext } from 'react';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { FULL_LANGUAGE_MAP, THEMES } from 'const/index';
import { GLOBE, PURPS_TICK_MARK } from 'assets/SvgIcons';
import { MBContext } from 'contexts/MBContext';

const LanguageSelector = (props) => {
  const handleClick = () => {
    const { toggleDropdown } = props;
    toggleDropdown();
  };

  const { currentLanguage, languageDropdown, isMobile, languages } = props;

  const { mbTheme } = useContext(MBContext);

  const selectorRef = useRef(null);
  const parentRef = useRef(null);
  const exceptionElementRefs = [parentRef];
  useCaptureClickOutside(selectorRef, handleClick, exceptionElementRefs);

  return (
    <div
      onClick={handleClick}
      ref={parentRef}
      className="language-selector-container"
      role="button"
      tabIndex={0}
    >
      <div className="current-langauge">
        <span className="current-language-toggle">
          {mbTheme !== THEMES.MIN_BLUE && !isMobile ? GLOBE : null}
          {isMobile
            ? currentLanguage.slice(0, 2)
            : FULL_LANGUAGE_MAP[currentLanguage]?.language}
        </span>
      </div>
      {languageDropdown ? (
        <div
          ref={selectorRef}
          className={`language-dropdown ${
            languageDropdown ? 'language-dropdown-active' : ''
          }`}
        >
          {languages.map((doc, index) => {
            const { url, lang } = doc || {};
            return (
              <a
                className={currentLanguage == lang ? 'active-tab' : ''}
                key={index}
                href={url}
              >
                <div className="language">
                  <span className="lang-option">
                    {FULL_LANGUAGE_MAP[lang].language}
                  </span>
                  {currentLanguage == lang ? PURPS_TICK_MARK : null}
                </div>
              </a>
            );
          })}
          {isMobile ? (
            <div
              onClick={handleClick}
              className="close-btn"
              role="button"
              tabIndex={0}
            >
              Close
            </div>
          ) : null}
        </div>
      ) : null}
      {isMobile && languageDropdown ? (
        <div
          onClick={handleClick}
          className="close-mask"
          role="button"
          tabIndex={0}
        ></div>
      ) : null}
      <style jsx>
        {`
          .language-dropdown {
            z-index: 10;
            border: 1px solid #dadada;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
          }

          .language-selector-container {
            position: relative;
            margin-left: 30px;
          }

          .lang {
            transform: translateY(-2px);
          }

          .language-selector-container {
            margin: 0;
          }
          .language-selector {
            line-height: 1;
          }
          .current-language-toggle {
            display: grid;
            grid-column-gap: 8px;
            grid-auto-flow: column;
            align-items: center;
            font-family: ${SOLEIL.FONT_STACK};
            font-size: 16px;
            text-transform: capitalize;
            cursor: pointer;
            font-weight: ${SOLEIL.REGULAR};
          }
          .language-dropdown {
            padding: 20px 15px;
            background: #fff;
            grid-row-gap: 24px;
            border-radius: 4px;
            display: grid;
            position: absolute;
            top: calc(100% + 10px);
            left: -15px;
          }

          .language,
          .close-btn {
            font-family: ${SOLEIL.FONT_STACK};
            cursor: pointer;
            font-size: 16px;
            border: none;
            text-transform: capitalize;
            display: grid;
            padding: 0;
            min-width: 150px;
          }
          .language-dropdown .active-tab {
            color: ${COLORS.PURPS};
          }
          .current-langauge {
            display: flex;
          }

          @media (max-width: 768px) {
            .language-dropdown {
              position: fixed;
              bottom: -2px;
              top: unset;
              left: 50%;
              transform: translateX(-50%);
              z-index: 999;
              width: 100%;
              text-align: center;
              grid-gap: 0;
              padding: 0;
              border-radius: 4px;
            }
            .language-dropdown-active {
              animation: scroll-in ease 0.3s forwards;
            }
            .language-dropdown .active-tab {
              color: #545454;
            }
            .current-language-toggle {
              text-transform: uppercase;
            }

            .language-selector-container {
              position: unset !important;
            }
            .language,
            .close-btn {
              border-bottom: 1px solid #dadada;
              padding: 16px 0;
              background: none;
            }
            .language .check-mark {
              display: none;
            }

            .close-mask {
              position: fixed;
              top: 0;
              left: 0;
              height: 100vh;
              width: 100vw;
              background: #000;
              opacity: 0.5;
              z-index: 500;
            }
            .close-btn {
              color: ${COLORS.PURPS};
            }

            @keyframes scroll-in {
              from {
                bottom: -100%;
              }
              to {
                bottom: -2px;
              }
            }
          }
        `}
      </style>
    </div>
  );
};

export default LanguageSelector;
