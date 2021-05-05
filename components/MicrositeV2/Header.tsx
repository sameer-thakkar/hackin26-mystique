import React, {
  ComponentType,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import dynamic from 'next/dynamic';
import InteractionContext from 'contexts/Interaction';
import LanguageSelector from 'components/MicrositeV2/LanguageSelector';
import Image from 'components/UI/Image';
import MultiLevelNav from 'components/MultiLevelNav';
import { groupSlices } from 'utils/helper';
import Hamburger from 'components/UI/Hamburger';
import HeaderLinks from 'components/HeaderLinks';
import { SEARCH_ICON, POWERED_BY_HEADOUT } from 'assets/SvgIcons';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { PAGETYPE, ALLOW_IMMEDIEATE_NESTING, THEMES } from 'const/index';

const SearchBox: ComponentType<any> = dynamic(
  () => import('./SearchBox').then((mod) => mod.SearchBox),
  { ssr: false }
);
const SearchItem: ComponentType<any> = dynamic(
  () => import('./SearchItem').then((mod) => mod.SearchItem),
  { ssr: false }
);
const ResponsiveSelector: ComponentType<any> = dynamic(
  () =>
    import('components/MicrositeV2/ResponsiveSelector').then(
      (m) => m.ResponsiveSelector
    ),
  { ssr: false }
);

const StyledHeader = styled.span`
  header {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: center;
    padding-top: 14px;
    padding-bottom: 14px;
    user-select: none;
  }
  .fixed-wrap {
    position: fixed;
    width: 100%;
    top: 0;
    min-height: ${({ isGlobalMb }) => (isGlobalMb ? '64px' : '80px')};
    ${({ isGlobalMb }) =>
      isGlobalMb && `box-shadow: inset 0px -1px 0px ${COLORS.GREY_D7};`}

    background-color: ${({ theme: { primaryBackground } }) =>
      primaryBackground ? primaryBackground : '#fff'};
    z-index: ${({ overlayActive: check, headerHover }) =>
      check || headerHover ? 100 : 15};
  }
  .fixed-offset::after {
    content: '';
    display: block;
    height: ${({ theme: { theme } }) =>
      theme === THEMES.DEFAULT ? '88px' : '80px'};
  }
  header .header-city-selector {
    min-width: 180px;
    font-family: ${SOLEIL.FONT_STACK};
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
      min-height: ${({ isGlobalMb }) => (isGlobalMb ? '48px' : '56px')};
    }
    .fixed-offset::after {
      content: '';
      display: block;
      height: ${({ theme: { theme } }) =>
        theme === THEMES.DEFAULT ? '57px' : '32px'};
      margin-bottom: ${({ isGlobalMb }) => (isGlobalMb ? '0' : '24px')};
    }
    .header-links {
      display: none;
    }
    header {
      padding: 12px 16px;
      border-bottom: ${({ theme: { theme } }) =>
        theme === THEMES.DEFAULT ? '1px solid #dadada' : 'none'};
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
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.REGULAR};
    color: ${({ theme: { primaryBGText } }) =>
      primaryBGText ? primaryBGText : COLORS.FOUR_BLACK};
  }

  .buy-tickets.global-mb {
    background: ${COLORS.RHAPSODY};
    color: ${COLORS.WHITE};
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 16px;
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
    line-height: 24px;
  }
  .current-language-toggle {
    color: ${({ theme: { primaryBGText } }) =>
      primaryBGText ? primaryBGText : COLORS.FOUR_BLACK};
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
      hasSearch: col3,
    }) => `repeat(${Number(col1) + Number(col2) + Number(col3)}, auto)`};
    align-items: center;
    .buy-tickets {
      display: none;
    }
    .current-language-toggle {
      margin-bottom: 0;
      padding: 0;
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
    padding: ${({ isGlobalMb }) => (isGlobalMb ? '0' : '8px')};
    margin-right: 16px;
    img {
      height: 36px;
      margin: 0;
      max-width: 160px;
      width: auto;
    }
  }
  .poweredBy svg {
    height: 36px;
    width: auto;
  }

  @media (max-width: 768px) {
    .header-logo {
      padding: ${({ isGlobalMb }) => (isGlobalMb ? '0' : '4px')};
      img {
        height: ${({ isGlobalMb }) => (isGlobalMb ? '36px' : '24px')};
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
      font-family: ${SOLEIL.FONT_STACK};
    }
    .inline-availability {
      color: #24a1b2;
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

interface HeaderProps {
  languageProps: any;
  isMobile: boolean;
  allTours: any[];
  host: string;
  enableDropdownLinks: boolean;
  dropdownLinks: any;
  logoRedirectionURL?: string;
  logoUrl: string;
  logoAltText: string;
  enableSearch: boolean;
  enableBuyTickets: boolean;
  hasPoweredByHeadoutLogo: boolean;
  headerSlices?: any[];
  headerLinks?: any[];
  hasLanguageSelector: boolean;
  changePage?: any;
  isGlobalMb?: boolean;
  buyTicketsLink?: string;
}

const Header: FunctionComponent<HeaderProps> = ({
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
  hasLanguageSelector,
  changePage,
  isGlobalMb = false,
  buyTicketsLink = '',
}) => {
  const interactionContext = useContext(InteractionContext);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [resultClicked, setResultClicked] = useState(false);
  const [navActive, toggleNav] = useState(false);
  const [headerHover, setHeaderHover] = useState(false);
  const toggleLanguageDropdown = () => {
    setLanguageDropdown(!languageDropdown);
  };
  const handleResults = (results) => {
    setResults(results);
    setResultClicked(false);
  };
  const loadSearchPage = () => {
    changePage({ name: PAGETYPE.SEARCH });
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

  const allToursArray = Object?.values(allTours);
  const hasDropdownLinks = enableDropdownLinks && dropdownLinks.length;
  const hasLanguageDropdown =
    languageProps?.languages?.length >= 1 && hasLanguageSelector;
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
  const hamburgerIconCheck = !!(
    headerLinks?.filter((link) => link?.link_url)?.length || headerSlices.length
  );
  const [scrollPos, setScrollPos] = useState(0);
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setIsMobileDevice(isMobile);
  }, []);
  useEffect(() => {
    if (!window) return;
    const scrollHandler = () => {
      setScrollPos(window.pageYOffset);
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }, [scrollPos]);
  return (
    <StyledHeader
      overlayActive={languageDropdown || navActive}
      headerHover={headerHover}
      isGlobalMb={isGlobalMb}
    >
      <div className="fixed-offset"></div>
      <div className="fixed-wrap">
        <header className="main-wrapper">
          <HeaderLeft
            hasDropdownLinks={hasDropdownLinks}
            onMouseEnter={() => setHeaderHover(true)}
            onMouseLeave={() => setHeaderHover(false)}
            isGlobalMb={isGlobalMb}
          >
            <a href={logoRedirectionURL || '/'}>
              <div className="header-logo">
                <Image url={logoUrl} alt={logoAltText} dontLazyLoad={true} />
                {hasPoweredByHeadoutLogo ? (
                  <span className="poweredBy">{POWERED_BY_HEADOUT}</span>
                ) : null}
              </div>
            </a>
            {!isMobileDevice && hasDropdownLinks ? (
              <div className="header-links">
                <ResponsiveSelector
                  options={dropdownLinks}
                  onChange={(option) => (window.location.href = option.value)}
                  customClassName="header-city-selector"
                />
              </div>
            ) : null}
            {!isMobileDevice && enableSearch && (
              <SearchWrapper>
                <SearchBox
                  isMobile={isMobileDevice}
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
            hasHamburger={isMobileDevice && hamburgerIconCheck}
            hasSearch={enableSearch}
            onMouseEnter={() => setHeaderHover(true)}
            onMouseLeave={() => setHeaderHover(false)}
          >
            {!groupedHeaderSlices.length && headerLinks ? (
              <HeaderLinks
                headerLinks={headerLinks}
                isMobile={isMobileDevice}
                hiddenMobile={navActive}
              />
            ) : null}

            {groupedHeaderSlices.length ? (
              <MultiLevelNav
                isActive={navActive}
                isMobile={isMobileDevice}
                slice={groupedHeaderSlices || []}
                oldMenuItems={convertedRegularMenuItems}
                isGlobalMb={isGlobalMb}
              />
            ) : null}
            {enableBuyTickets ? (
              <>
                <Conditional if={isGlobalMb && scrollPos > 450}>
                  <a href={buyTicketsLink} className="buy-tickets global-mb">
                    Buy Tickets
                  </a>
                </Conditional>
                <Conditional if={!isGlobalMb}>
                  <div
                    className="buy-tickets"
                    tabIndex={0}
                    role="button"
                    onClick={buyTicketHandler}
                  >
                    Buy Tickets
                  </div>
                </Conditional>
              </>
            ) : null}
            {isMobileDevice && enableSearch && (
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
            <Conditional if={hasLanguageDropdown}>
              <LanguageSelector
                {...languageProps}
                languageDropdown={languageDropdown}
                toggleDropdown={toggleLanguageDropdown}
                hasLanguageDropdown={hasLanguageSelector}
                host={host}
                isMobile={isMobileDevice}
              />
            </Conditional>
            <Conditional if={isMobileDevice && hamburgerIconCheck}>
              <Hamburger
                className={'hamburger'}
                isActive={navActive}
                onClickFn={() => toggleNav(!navActive)}
                isGlobalMb={isGlobalMb}
              />
            </Conditional>
          </HeaderRight>
        </header>
      </div>
    </StyledHeader>
  );
};

export default Header;
