import React, {
  ComponentType,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { currencyListAtom } from 'store/atoms/currencyList';
import { MBContext } from 'contexts/MBContext';
import Image from 'components/UI/Image';
import MultiLevelNav from 'components/MultiLevelNav';
import LocaleSelector from 'components/common/LocaleSelector';
import Hamburger from 'components/UI/Hamburger';
import HeaderLinks from 'components/HeaderLinks';
import Conditional from 'components/common/Conditional';
import { SEARCH_ICON, POWERED_BY_HEADOUT } from 'assets/SvgIcons';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import {
  PAGETYPE,
  ALLOW_IMMEDIEATE_NESTING,
  THEMES,
  ANALYTICS_EVENTS,
} from 'const/index';
import { strings } from 'const/strings';
import { groupSlices, withTrailingSlash } from 'utils/helper';
import { createBookingURL } from 'utils';
import { convertUidToUrl } from 'utils/urlUtils';
import { trackEvent } from 'utils/analytics';

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

const StyledHeader = styled.div`
  .main-wrapper {
    display: grid;
    grid-template-columns: repeat(2, auto);
    justify-content: space-between;
    align-items: center;
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '20px 0' : '14px 0'};
    user-select: none;
  }
  .fixed-wrap {
    position: fixed;
    width: calc(100vw - (100vw - 100%));
    top: 0;
    min-height: ${({ isGlobalMb }) => (isGlobalMb ? '64px' : '80px')};
    background-color: ${({ theme: { primaryBackground } }) =>
      primaryBackground ? primaryBackground : '#fff'};
    z-index: ${({ overlayActive: check, headerHover }) =>
      check || headerHover ? 100 : 15};
    ${({ isGlobalMb }) =>
      isGlobalMb && `box-shadow: inset 0px -1px 0px ${COLORS.GRAY.G5};`}
    ${({ isEntertainmentMbListicle }) =>
      isEntertainmentMbListicle &&
      `border-bottom: 1px solid ${COLORS.GRAY.G6};`}
  }
  .fixed-offset::after {
    content: '';
    display: block;
    height: ${({ theme: { theme } }) =>
      theme === THEMES.DEFAULT ? '88px' : '80px'};
  }
  .main-wrapper .header-city-selector {
    min-width: 180px;
    font-family: ${HALYARD.FONT_STACK};
  }
  .header-city-selector .toggle-icon svg path {
    stroke-width: 1.5px;
  }
  .header-city-selector .current-selection {
    border-radius: 4px;
    padding: 12px 15px;
    border: 1px solid ${COLORS.GRAY.G2};
  }

  @media (max-width: 768px) {
    .main-wrapper {
      margin: unset;
      width: calc(100% - (16px * 2));
      padding: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '15px 16px' : '12px 16px'};
      border-bottom: ${({ theme: { theme } }) =>
        theme === THEMES.DEFAULT ? `1px solid ${COLORS.GRAY.G6}` : 'none'};
    }
    .fixed-wrap {
      min-height: ${({ isGlobalMb }) => (isGlobalMb ? '48px' : '56px')};
      height: ${({ isGlobalMb }) => (isGlobalMb ? '48px' : '56px')};
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
  }
`;

const HeaderRight = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column !important;
  grid-auto-columns: auto;
  align-items: center;
  .buy-tickets {
    font-size: 16px;
    cursor: pointer;
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 400;
    color: ${({ theme: { primaryBGText } }) =>
      primaryBGText ? primaryBGText : COLORS.GRAY.G2};
  }

  .buy-tickets.global-mb {
    background: ${COLORS.BRAND.PURPS};
    color: ${COLORS.BRAND.WHITE};
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
  .current-language-toggle {
    color: ${({ theme: { primaryBGText } }) =>
      primaryBGText ? primaryBGText : COLORS.GRAY.G2};
  }
  .mobi-search-trigger {
    height: 20px;
    width: 20px;
  }
  @media (max-width: 768px) {
    grid-auto-flow: unset;
    grid-template-columns: repeat(auto-fill, minmax(1.875rem, 1fr));
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
    .globe-icon {
      padding: 0px;
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
    align-items: center;
    padding: ${({ isGlobalMb, isEntertainmentMb }) =>
      isGlobalMb || isEntertainmentMb ? '0' : '8px'};
    margin-right: 16px;
    ${({ isEntertainmentMb }) => isEntertainmentMb && `height: 36px;`}

    .center {
      display: flex;
    }

    span {
      width: initial !important;
      height: initial !important;
    }

    img {
      height: 36px !important;
      margin: 0;
      max-width: 160px !important;
      width: auto !important;
      padding-right: 5px !important;
      position: relative !important;
    }
  }
  .poweredBy svg {
    height: 36px;
    width: auto;
  }

  @media (max-width: 768px) {
    .header-logo {
      padding: ${({ isGlobalMb, isEntertainmentMb }) =>
        isGlobalMb || isEntertainmentMb ? '0' : '4px'};
      ${({ isEntertainmentMb }) => isEntertainmentMb && `height: 20px;`}
      img {
        position: relative !important;
        height: ${({ isGlobalMb, isEntertainmentMb }) => {
          const height = isGlobalMb ? 36 : isEntertainmentMb ? 20 : 24;
          return `${height}px !important;`;
        }};
        ${({ isEntertainmentMb }) =>
          isEntertainmentMb && `width: 87px !important;`}
      }
    }
    .poweredBy svg {
      height: 24px;
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
    border: 1px solid ${COLORS.GRAY.G6};
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
      font-weight: normal;
      font-family: ${HALYARD.FONT_STACK};
    }
    .inline-availability {
      color: ${COLORS.TEXT.BEACH};
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
  isEntertainmentMb?: boolean;
  isEntertainmentMbListicle?: boolean;
  hideCurrencySelector?: boolean;
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
  isEntertainmentMb = false,
  isEntertainmentMbListicle,
  hideCurrencySelector = false,
}) => {
  const { lang, nakedDomain, redirectToHeadoutBookingFlow } = useContext(
    MBContext
  );

  const [results, setResults] = useState([]);
  const [resultClicked, setResultClicked] = useState(false);
  const [navActive, toggleNav] = useState(false);
  const [headerHover, setHeaderHover] = useState(false);

  const handleResults = (results) => {
    setResults(results);
    setResultClicked(false);
  };
  const loadSearchPage = () => {
    changePage({ name: PAGETYPE.SEARCH });
  };
  const onSearchResultClick = (tgid, showPageUid) => {
    const bookingURL = createBookingURL({
      nakedDomain,
      lang,
      tgid,
      redirectToHeadoutBookingFlow,
    });
    const showPageUrl = showPageUid
      ? convertUidToUrl({ uid: showPageUid, hostname: host })
      : bookingURL;

    window.open(showPageUrl ?? bookingURL, '_self', 'noopener,noreferrer');
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
  const groupedHeaderSlices = groupSlices(
    headerSlices,
    ALLOW_IMMEDIEATE_NESTING
  );
  const headerCurrencies = useRecoilValue(currencyListAtom);
  const headerLanguages = languageProps?.languages.length
    ? [...(languageProps?.languages ?? []), { code: lang }]
    : [];

  const convertedRegularMenuItems =
    headerLinks
      ?.filter((link) => !!link.link_url?.url && !!link.link_heading)
      ?.map((link) => ({
        slice_type: 'menu_item',
        primary: {
          label: link.link_heading,
          url: {
            url: withTrailingSlash(link?.link_url?.url),
            target: link.link_url.target,
          },
        },
      })) || [];
  const hamburgerIconCheck = !!(
    headerLinks?.filter((link) => link?.link_url)?.length || headerSlices.length
  );

  const [showBuyTickets, setShowBuyTickets] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile);

  useEffect(() => {
    if (!window) return;
    const isMobile = window.innerWidth <= 800;
    setIsMobileDevice(isMobile);
    window.addEventListener(
      'scroll',
      () => {
        if (window.pageYOffset > 450) {
          setShowBuyTickets(true);
        } else {
          setShowBuyTickets(false);
        }
      },
      { passive: true }
    );
  }, []);

  return (
    <StyledHeader
      overlayActive={navActive}
      headerHover={headerHover}
      isGlobalMb={isGlobalMb}
      isEntertainmentMb={isEntertainmentMb}
      isEntertainmentMbListicle={isEntertainmentMbListicle}
    >
      <div className="fixed-offset"></div>
      <div className="fixed-wrap">
        <header className="main-wrapper">
          <HeaderLeft
            hasDropdownLinks={hasDropdownLinks}
            onMouseEnter={() => setHeaderHover(true)}
            onMouseLeave={() => setHeaderHover(false)}
            isGlobalMb={isGlobalMb}
            isEntertainmentMb={isEntertainmentMb}
          >
            <a href={logoRedirectionURL || '/'}>
              <div className="header-logo">
                <Image
                  url={logoUrl}
                  alt={logoAltText}
                  priority
                  height={isMobileDevice ? '22' : '44'}
                  width={isMobileDevice ? '87' : '144'}
                  layout={'fixed'}
                  className="center"
                />
                <Conditional if={hasPoweredByHeadoutLogo}>
                  <span className="poweredBy">{POWERED_BY_HEADOUT}</span>
                </Conditional>
              </div>
            </a>
            <Conditional if={!isMobileDevice && hasDropdownLinks}>
              <div className="header-links">
                <ResponsiveSelector
                  options={dropdownLinks}
                  onChange={(option) => (window.location.href = option.value)}
                  customClassName="header-city-selector"
                />
              </div>
            </Conditional>
            <Conditional if={!isMobileDevice && enableSearch}>
              <SearchWrapper>
                <SearchBox
                  isMobile={isMobileDevice}
                  handleResults={handleResults}
                  allToursArray={allToursArray}
                  clearSearch={resultClicked}
                  isEntertainmentMb={isEntertainmentMb}
                />
                <Conditional if={results.length}>
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
                </Conditional>
              </SearchWrapper>
            </Conditional>
          </HeaderLeft>
          <HeaderRight
            hasLanguageDropdown={hasLanguageSelector}
            hasHamburger={isMobileDevice && hamburgerIconCheck}
            hasSearch={enableSearch}
            onMouseEnter={() => setHeaderHover(true)}
            onMouseLeave={() => setHeaderHover(false)}
          >
            <Conditional if={!groupedHeaderSlices.length && headerLinks}>
              <HeaderLinks
                headerLinks={headerLinks}
                isMobile={isMobileDevice}
                hiddenMobile={navActive}
              />
            </Conditional>

            <Conditional if={groupedHeaderSlices.length}>
              <MultiLevelNav
                isActive={navActive}
                isMobile={isMobileDevice}
                slice={groupedHeaderSlices || []}
                oldMenuItems={convertedRegularMenuItems}
                isGlobalMb={isGlobalMb}
              />
            </Conditional>
            <Conditional if={enableBuyTickets}>
              <Conditional if={isGlobalMb && showBuyTickets}>
                <a href={buyTicketsLink} className="buy-tickets global-mb">
                  {strings.BANNER_CTA}
                </a>
              </Conditional>
              <Conditional if={!isGlobalMb}>
                <div
                  className="buy-tickets"
                  tabIndex={0}
                  role="button"
                  onClick={buyTicketHandler}
                >
                  {strings.BANNER_CTA}
                </div>
              </Conditional>
            </Conditional>
            <Conditional if={isMobileDevice && enableSearch}>
              <div
                className="mobi-search-trigger"
                role="button"
                tabIndex={0}
                onClick={() => {
                  trackEvent({
                    eventName: ANALYTICS_EVENTS.SEARCH_ICON_CLICKED,
                  });
                  loadSearchPage();
                }}
              >
                {SEARCH_ICON}
              </div>
            </Conditional>
            <Conditional
              if={
                !isMobile &&
                (headerLanguages?.length || headerCurrencies?.length)
              }
            >
              <LocaleSelector
                languages={headerLanguages}
                currencies={headerCurrencies}
                currentLanguage={lang}
                hasLanguageDropdown={hasLanguageSelector}
                hasCurrencySelector={hideCurrencySelector}
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
