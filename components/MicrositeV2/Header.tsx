import React, { useContext, useState } from 'react';
import LanguageSelector from './LanguageSelector';
import { SearchBox } from './SearchBox';
import { PAGETYPE } from '../../constants';
import { SEARCH_ICON } from '../../public/static/svg-icons';
import { InteractionContext } from '../../contexts/Interaction';
import { SearchItem } from './SearchItem';
import { COLORS, AVENIR, SIZES } from '../../constants/ui-constants';
import { ResponsiveSelector } from './ResponsiveSelector';
const Header = props => {
  const interactionContext = useContext(InteractionContext);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [resultClicked, setResultClicked] = useState(false);

  const toggleLanguageDropdown = () => {
    setLanguageDropdown(!languageDropdown);
  };
  const handleResults = results => {
    setResults(results);
    setResultClicked(false);
  };
  const loadSearchPage = () => {
    props.changePage({ name: PAGETYPE.SEARCH });
  };
  const onSearchResultClick = tgid => {
    const { clickTour } = interactionContext;
    clickTour(tgid, true);
    setResultClicked(true);
  };
  const headerProps = props;
  const { languageProps, isMobile, allTours, host } = props;
  const allToursArray = Object.values(allTours);
  const hasDropdownLinks = headerProps.dropdownLinks.length;
  const hasLanguageDropdown =
    languageProps.availableLanguages.length &&
    languageProps.languages.length &&
    languageProps.languageDropdown;
  return (
    <div className="fixed-offset">
      <div className="fixed-wrap">
        <header className="mb-wrapper">
          <div className="header-left">
            <a href={headerProps.logoRedirectionURL}>
              <div className="header-logo">
                <img src={headerProps.logoUrl} alt={headerProps.logoAltText} />
              </div>
            </a>
            {!props.isMobile && hasDropdownLinks ? (
              <div className="header-links">
                <ResponsiveSelector
                  options={headerProps.dropdownLinks}
                  onChange={option => (window.location.href = option.value)}
                  customClassName="header-city-selector"
                />
              </div>
            ) : null}
            {!isMobile && headerProps.enableSearch && (
              <div className="search-wrapper">
                <SearchBox
                  isMobile={isMobile}
                  handleResults={handleResults}
                  allToursArray={allToursArray}
                  clearSearch={resultClicked}
                />
                {results.length ? (
                  <div>
                    <div className="results">
                      {results.map((experience, index) => {
                        return (
                          <SearchItem
                            {...experience}
                            onSearchResultClick={onSearchResultClick}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="header-right">
            {/* <nav></nav> */}
            {isMobile && (
              <div
                className="mobi-search-trigger"
                onClick={() => {
                  loadSearchPage();
                }}
              >
                {SEARCH_ICON}
              </div>
            )}
            <LanguageSelector
              {...languageProps}
              languageDropdown={languageDropdown}
              toggleDropdown={toggleLanguageDropdown}
              host={host}
              isMobile={isMobile}
            />
          </div>
        </header>
      </div>
      <style jsx>
        {`
          header {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-between;
            align-items: center;
            padding-top: 19px;
            padding-bottom: 19px;
            z-index: ${languageDropdown ? 100 : 15};
            user-select: none;
          }
          .fixed-wrap {
            position: fixed;
            width: 100%;
            min-height: 80px;
            background: #fff;
            z-index: ${languageDropdown ? 100 : 15};
          }
          .fixed-offset::after {
            content: '';
            display: block;
            height: 88px;
          }
          header .header-logo {
            height: unset;
            display: flex;
            margin-right: 16px;
          }
          header .header-logo img {
            height: 36px;
            margin: 0;
            max-width: unset;
            width: auto;
          }
          .header-left {
            display: grid;
            grid-template-columns: auto ${hasDropdownLinks ? '1fr' : ''} auto;
            grid-gap: 24px;
            align-items: center;
          }

          .mobi-search-trigger {
            height: 20px;
            width: 20px;
          }

          .search-wrapper {
            position: relative;
          }

          .results {
            position: absolute;
            padding: 10px;
            top: calc(100% + 10px);
            left: 0;
            width: calc(100% - 20px);
            z-index: 10;
            background: #fff;
            display: grid;
            grid-row-gap: 10px;
            border: 1px solid #dadada;
            box-shadow: 0 4px 6px #0000002b;
          }

          @media (max-width: 768px) {
            header .header-logo img {
              height: 24px;
            }
            header {
              padding: 16px;
            }
            .fixed-wrap {
              min-height: 56px;
            }
            .fixed-offset::after {
              content: '';
              display: block;
              height: 57px;
              margin-bottom: 24px;
            }
            .header-links,
            .search-wrapper {
              display: none;
            }

            .header-right {
              display: grid;
              grid-template-columns: auto ${hasLanguageDropdown ? 'auto' : ''};
              grid-gap: 22px;
              align-items: center;
            }
          }
        `}
      </style>
      <style jsx global>
        {`
          .header-city-selector {
            min-width: 180px;
            font-family: ${AVENIR.FONT_STACK};
          }
          .header-city-selector .toggle-icon svg path {
            stroke-width: 1.5px;
          }
          .header-city-selector .current-selection {
            border-radius: 4px;
            padding: 12px 15px;
            border: 1px solid ${COLORS.DADDY};
          }
          .mb-wrapper {
            padding: 0 5.46vw;
            max-width: ${SIZES.MAX_WIDTH};
            margin: 0 auto;
          }

          .results img {
            width: 104px;
            height: 64px;
            border-radius: 2px;
            object-fit: cover;
          }

          .search-wrapper .input-icon path {
            stroke-width: 1.5px;
          }

          .booster p {
            margin: 0;
          }

          .results .booster * {
            font-size: 12px;
            font-weight: regular;
          }
          .results .booster {
            font-family: Graphik;
          }
          .results .inline-availability {
            color: #24a1b2;
          }

          @media (max-width: 768px) {
            header {
              padding: 12px 16px;
              border-bottom: 1px solid #dadada;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Header;
