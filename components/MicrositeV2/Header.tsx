import React, { useContext, useState } from 'react';
import LanguageSelector from './LanguageSelector';
import InteractionContext from '../../contexts/Interaction';
import Image from '../UI/Image';
import { SearchBox } from './SearchBox';
import { PAGETYPE, ALLOW_IMMEDIEATE_NESTING } from '../../constants';
import { SEARCH_ICON, POWERED_BY_HEADOUT } from '../../assets/SvgIcons';
import { SearchItem } from './SearchItem';
import { COLORS, AVENIR, GRAPHIK } from '../../constants/ui-constants';
import { ResponsiveSelector } from './ResponsiveSelector';
import styled from 'styled-components';
import MultiLevelNav from '../MultiLevelNav';
import { groupSlices } from '../../utils/helper';
import Hamburger from '../UI/Hamburger';
import HeaderLinks from '../HeaderLinks';

const StyledHeader = styled.span`
  header {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: center;
    padding-top: 14px;
    padding-bottom: 14px;
    z-index: ${({ overlayActive: check }) => (check ? 100 : 15)};
    user-select: none;
  }
  .fixed-wrap {
    position: fixed;
    width: 100%;
    top: 0;
    min-height: 80px;
    background: #fff;
    z-index: ${({ overlayActive: check }) => (check ? 100 : 15)};
  }
  .fixed-offset::after {
    content: '';
    display: block;
    height: 88px;
  }
  header .header-city-selector {
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

  @media (max-width: 768px) {
    header {
      padding: 12px;
    }
    .main-wrapper {
      margin: unset;
      width: calc(100% - (16px * 2));
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
    .header-links {
      display: none;
    }
    header {
      padding: 12px 16px;
      border-bottom: 1px solid #dadada;
    }
  }
`;

const HeaderRight = styled.div`
  display: grid;
  grid-gap: 22px;
  grid-auto-flow: column;
  align-items: center;
  .buy-tickets {
    font-size: 16px;
    cursor: pointer;
    font-family: ${GRAPHIK.FONT_STACK};
    font-weight: ${GRAPHIK.REGULAR};
    color: ${COLORS.DAVY_GREY};
  }
  .mobi-search-trigger {
    height: 20px;
    width: 20px;
  }
  @media (max-width: 768px) {
    grid-auto-flow: unset;
    grid-template-columns: ${({
      hasLanguageDropdown: col1,
      hasHamburger: col2,
    }) => `repeat(${Number(col1) + Number(col2) + 1}, auto)`};
    align-items: center;
    .buy-tickets {
      display: none;
    }
    .current-language-toggle {
      margin-bottom: -2px;
      padding: 2px;
    }
    .hamburger {
      position: relative;
      transform: unset;
      top: unset;
      right: unset;
    }
  }
`;

const HeaderLeft = styled.div`
  display: grid;
  grid-template-columns: auto ${({ hasDropdownLinks }) =>
      hasDropdownLinks ? '1fr' : ''} auto;
  grid-gap: 24px;
  align-items: center;
  .header-logo {
    height: unset;
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 10px;
    padding: 8px;
    margin-right: 16px;
    img {
      height: 36px;
      margin: 0;
      max-width: unset;
      width: auto;
    }
  }
  .poweredBy svg {
    height: 36px;
    width: auto;
  }

  @media (max-width: 768px) {
    .header-logo {
      padding: 4px;
      img {
        height: 24px;
      }
    }
    .poweredBy svg {
      height: 24px;
      width: auto;
    }
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  .input-icon path {
    stroke-width: 1.5px;
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
    img {
      width: 104px;
      height: 64px;
      border-radius: 2px;
      object-fit: cover;
    }
    .booster p {
      margin: 0;
    }
    .booster * {
      font-size: 12px;
      font-weight: regular;
      font-family: ${GRAPHIK.FONT_STACK};
    }
    .inline-availability {
      color: #24a1b2;
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const Header = (props) => {
  const interactionContext = useContext(InteractionContext);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [resultClicked, setResultClicked] = useState(false);
  const [navActive, toggleNav] = useState(false);

  const toggleLanguageDropdown = () => {
    setLanguageDropdown(!languageDropdown);
  };
  const handleResults = (results) => {
    setResults(results);
    setResultClicked(false);
  };
  const loadSearchPage = () => {
    props.changePage({ name: PAGETYPE.SEARCH });
  };
  const onSearchResultClick = (tgid) => {
    const { clickTour } = interactionContext;
    clickTour(tgid, true);
    setResultClicked(true);
  };
  const buyTicketHandler = () => {
    window.scrollBy({
      top: 540,
      behavior: 'smooth',
    });
  };

  const {
    languageProps,
    isMobile,
    allTours,
    host,
    enableDropdownLinks,
    dropdownLinks,
    logoRedirectionURL,
    logoUrl,
    logoAltText,
    enableSearch,
    enableBuyTickets,
    hasPoweredByHeadoutLogo,
    headerSlices = [],
    headerLinks,
  } = props;
  const allToursArray = Object.values(allTours);
  const hasDropdownLinks = enableDropdownLinks && dropdownLinks.length;
  const hasLanguageDropdown =
    languageProps.languages.length > 1 && languageProps.languageDropdown;
  const groupedHeaderSlices = groupSlices(
    headerSlices,
    ALLOW_IMMEDIEATE_NESTING
  );
  const convertedRegularMenuItems = headerLinks?.map((link) => ({
    slice_type: 'menu_item',
    primary: {
      label: link.link_heading,
      url: {
        url: link.link_url.url,
        target: link.link_url.target,
      },
    },
  }));
  const hamburgerIconCheck = !!headerLinks?.length || headerSlices.length;

  return (
    <StyledHeader overlayActive={languageDropdown || navActive}>
      <div className="fixed-offset"></div>
      <div className="fixed-wrap">
        <header className="main-wrapper">
          <HeaderLeft hasDropdownLinks={hasDropdownLinks}>
            <a href={logoRedirectionURL || '/'}>
              <div className="header-logo">
                <Image url={logoUrl} alt={logoAltText} dontLazyLoad={true} />
                {hasPoweredByHeadoutLogo ? (
                  <span className="poweredBy">{POWERED_BY_HEADOUT}</span>
                ) : null}
              </div>
            </a>
            {!props.isMobile && hasDropdownLinks ? (
              <div className="header-links">
                <ResponsiveSelector
                  options={dropdownLinks}
                  onChange={(option) => (window.location.href = option.value)}
                  customClassName="header-city-selector"
                />
              </div>
            ) : null}
            {!isMobile && enableSearch && (
              <SearchWrapper>
                <SearchBox
                  isMobile={isMobile}
                  handleResults={handleResults}
                  allToursArray={allToursArray}
                  clearSearch={resultClicked}
                />
                {results.length ? (
                  <div>
                    <div className="results">
                      {results.map(({ item }, index) => {
                        return (
                          <SearchItem
                            key={index}
                            {...item}
                            onSearchResultClick={onSearchResultClick}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </SearchWrapper>
            )}
          </HeaderLeft>
          <HeaderRight
            hasLanguageDropdown={hasLanguageDropdown}
            hasHamburger={isMobile && hamburgerIconCheck}
          >
            {!groupedHeaderSlices && headerLinks ? (
              <HeaderLinks
                headerLinks={headerLinks}
                isMobile={isMobile}
                hiddenMobile={navActive}
              />
            ) : null}

            {groupedHeaderSlices ? (
              <MultiLevelNav
                isActive={navActive}
                isMobile={isMobile}
                slice={groupedHeaderSlices || []}
                oldMenuItems={convertedRegularMenuItems}
              />
            ) : null}
            {enableBuyTickets ? (
              <div
                className="buy-tickets"
                tabIndex={0}
                role="button"
                onClick={buyTicketHandler}
              >
                Buy Tickets
              </div>
            ) : null}
            {isMobile && enableSearch && (
              <div
                className="mobi-search-trigger"
                role="button"
                tabIndex={0}
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
            {isMobile && hamburgerIconCheck ? (
              <Hamburger
                className={'hamburger'}
                isActive={navActive}
                onClickFn={() => toggleNav(!navActive)}
              />
            ) : null}
          </HeaderRight>
        </header>
      </div>
    </StyledHeader>
  );
};

export default Header;
