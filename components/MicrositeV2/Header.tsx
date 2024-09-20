import React, {
  ComponentType,
  FocusEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import LocaleSelector from 'components/common/LocaleSelector';
import HeaderLinks from 'components/HeaderLinks';
import MultiLevelNav from 'components/MultiLevelNav';
import Hamburger from 'components/UI/Hamburger';
import Image from 'components/UI/Image';
import { MBContext } from 'contexts/MBContext';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { createBookingURL } from 'utils';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { throttle } from 'utils/gen';
import { groupSlices, withTrailingSlash } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import { appAtom } from 'store/atoms/app';
import { currencyListAtom } from 'store/atoms/currencyList';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  PAGETYPE,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import PoweredByHeadout from 'assets/poweredByHeadout';
import SearchIcon from 'assets/searchIcon';

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

interface IStyledHeader {
  isEntertainmentMb: boolean;
  isGlobalMb: boolean;
  isEntertainmentMbListicle?: boolean;
  overlayActive?: boolean;
  headerHover?: boolean;
  showColoredHeader: boolean;
  isTop?: boolean;
  isCategoryPage?: boolean;
  $isMonthOnMonthPage?: boolean;
  $isReviewsPage?: boolean;
  $isVenuePage?: boolean;
  isEntertainmentLandingPageVisible?: boolean;
  $categoryHeaderMenuExists: boolean;
  $isPillBarSticky: boolean;
  $isEntertainmentBanner?: boolean;
}

export const StyledHeader = styled.div<IStyledHeader>`
  min-height: ${({ isGlobalMb }) => (isGlobalMb ? '64px' : '80px')};
  .main-wrapper {
    display: grid;
    grid-template-columns: repeat(2, auto);
    justify-content: space-between;
    align-items: center;
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '1.25rem 0' : '0.75rem 0 0.625rem'};
    user-select: none;
  }
  .fixed-wrap {
    ${({ $categoryHeaderMenuExists }) =>
      !$categoryHeaderMenuExists && `position: fixed;`}
    box-shadow: ${({
      isTop,
      isEntertainmentLandingPageVisible,
      $isPillBarSticky,
    }) =>
      !isTop &&
      !isEntertainmentLandingPageVisible &&
      !$isPillBarSticky &&
      '0px -1px 2px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.12)'};
    width: calc(100vw - (100vw - 100%));
    top: 0;
    min-height: ${({ isGlobalMb }) => (isGlobalMb ? '64px' : '80px')};
    border-bottom: ${({ isEntertainmentMb, showColoredHeader }) =>
      isEntertainmentMb && !showColoredHeader && `1px ${COLORS.GRAY.G6} solid`};
    background-color: ${({ theme: { primaryBackground } }) =>
      primaryBackground ? primaryBackground : '#fff'};
    z-index: ${({ overlayActive: check, headerHover }) =>
      check || headerHover ? 100 : 19};
    ${({ isGlobalMb }) =>
      isGlobalMb && `box-shadow: inset 0px -1px 0px ${COLORS.GRAY.G5};`}
    ${({
      isEntertainmentMbListicle,
      $isPillBarSticky,
      $isMonthOnMonthPage,
      $isEntertainmentBanner,
    }) =>
      !$isMonthOnMonthPage &&
      !$isEntertainmentBanner &&
      (isEntertainmentMbListicle || $isPillBarSticky) &&
      `border-bottom: 1px solid ${COLORS.GRAY.G6};`}
      background:${({ showColoredHeader }) =>
      showColoredHeader ? '#150029' : '#fff'};
  }
  .fixed-offset::after {
    content: '';
    display: ${({ $categoryHeaderMenuExists }) =>
      $categoryHeaderMenuExists ? 'none' : 'block'};
    height: ${({ theme: { theme } }) =>
      theme === THEMES.DEFAULT ? '88px' : '80px'};
  }

  ${({ showColoredHeader }) =>
    showColoredHeader &&
    `.fixed-offset::before {
      content: '';
      position: fixed;
      width: 100vw;
      top: 0;
      display: block;
      background-color: #150029;
      height: 320px;
      @media (max-width: 789px) {
        height:200px;
      }
    }`}

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

  .styled-active-value {
    color: ${({ showColoredHeader }) =>
      showColoredHeader ? COLORS.BRAND.WHITE : COLORS.GRAY.G3};
  }
  @media (max-width: 768px) {
    min-height: ${({ isGlobalMb }) => (isGlobalMb ? '3rem' : '3.5rem')};
    .main-wrapper {
      margin: unset;
      width: calc(100% - (16px * 2));
      padding: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '15px 16px' : '12px 16px'};
      border-bottom: ${({ theme: { theme } }) =>
        theme === THEMES.DEFAULT ? `1px solid ${COLORS.GRAY.G6}` : 'none'};
      background: ${({
        showColoredHeader,
        isCategoryPage,
        $isMonthOnMonthPage,
        $isReviewsPage,
        $isVenuePage,
      }) => {
        switch (true) {
          case showColoredHeader:
            return isCategoryPage ||
              $isMonthOnMonthPage ||
              $isReviewsPage ||
              $isVenuePage
              ? '#1A0232'
              : COLORS.LTT_BANNER_BACKGROUND_COLOR;
          default:
            return '#fff';
        }
      }};
    }
    .fixed-wrap {
      position: fixed;
      min-height: ${({ isGlobalMb }) => (isGlobalMb ? '48px' : '56px')};
      height: ${({ isGlobalMb }) => (isGlobalMb ? '48px' : '56px')};
      background-color: transparent;
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

    ${({ showColoredHeader, isCategoryPage, $isMonthOnMonthPage }) =>
      showColoredHeader &&
      `.fixed-offset::before {
      background-color:${
        isCategoryPage || $isMonthOnMonthPage
          ? '#1A0232'
          : COLORS.LTT_BANNER_BACKGROUND_COLOR
      };
    }`}
  }
`;

const HeaderRight = styled.div<{
  isDarkMode?: boolean;
  isLtt?: boolean;
}>`
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
    padding: 6px;

    background-color: ${({ isDarkMode }) =>
      isDarkMode ? `${COLORS.BRAND.WHITE}20` : 'transparent'};
    border-radius: ${({ isDarkMode }) => (isDarkMode ? `50%` : 0)};

    svg {
      height: 20px;
      width: 20px;
      stroke-width: ${({ isLtt }) => (isLtt ? '1.2px' : '0.8px')};
      ${({ isDarkMode, isLtt }) =>
        isLtt &&
        `
        position: relative;
        path {
          stroke: ${isDarkMode ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};
        }
      `}
    }
  }
  .menu-item-text:not(a:has(> .menu-item-text)) {
    span.label {
      text-wrap: nowrap;
    }
  }
  .link-element a span.label {
    color: ${COLORS.GRAY.G3} !important;
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

interface IHeaderLeft {
  isGlobalMb: boolean;
  isEntertainmentMb: boolean;
  hasDropdownLinks?: boolean;
  isDarkMode?: boolean;
}

const HeaderLeft = styled.div<IHeaderLeft>`
  display: grid;
  grid-template-columns: auto ${({ hasDropdownLinks }) =>
      hasDropdownLinks ? '1fr' : ''} auto;
  grid-gap: 24px;
  align-items: center;
  .header-logo {
    width: 100%;
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
      ${({ isDarkMode }) =>
        isDarkMode && `filter: invert(1) hue-rotate(193deg) brightness(3);`}
      height: 36px !important;
      margin: 0;
      max-width: 160px !important;
      width: auto !important;
      padding-right: 5px !important;
      position: relative !important;
      object-fit: contain;
    }
  }
  .poweredBy svg {
    height: 36px;
    width: auto;
    ${({ isDarkMode }) =>
      isDarkMode &&
      `.cls-1 {
        fill: #fff;
      }`}
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

const SearchWrapper = styled.div<{ showColoredHeader: boolean }>`
  position: relative;
  .input-icon path {
    stroke-width: 1.5px;
    ${({ showColoredHeader }) => (showColoredHeader ? 'opacity: 0.5' : '')}
  }
  .results {
    position: absolute;
    padding: 10px;
    top: calc(100% + 6px);
    left: 0;
    border-radius: 6px;
    width: 100%;
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
  isCategoryPage?: boolean;
  isMonthOnMonthPage?: boolean;
  isEntertainmentMbListicle?: boolean;
  hideCurrencySelector?: boolean;
  primaryCity?: string;
  taggedCity?: string;
  categoryHeaderMenuExists?: boolean;
  categoryHeaderMenu?: Record<string, any>;
  isEntertainmentLandingPageVisible?: boolean;
  isNewsPage?: boolean;
  isReviewsPage?: boolean;
  isVenuePage?: boolean;
  uid?: string;
  showSeatMapExperiment?: boolean;
  isEntertainmentBanner?: boolean;
}

const Header: FunctionComponent<HeaderProps> = ({
  languageProps,
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
  isCategoryPage,
  isMonthOnMonthPage = false,
  buyTicketsLink = '',
  isEntertainmentMb = false,
  isEntertainmentMbListicle,
  hideCurrencySelector = false,
  primaryCity,
  taggedCity,
  categoryHeaderMenuExists = false,
  categoryHeaderMenu,
  isEntertainmentLandingPageVisible = false,
  isReviewsPage = false,
  isVenuePage = false,
  uid,
  showSeatMapExperiment,
  isEntertainmentBanner = false,
}) => {
  const { lang, nakedDomain, redirectToHeadoutBookingFlow } =
    useContext(MBContext);
  const { isMobile, isPillBarSticky } = useRecoilValue(appAtom);

  const resultSectionRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const multiNavRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState([]);
  const [resultClicked, setResultClicked] = useState(false);
  const [navActive, toggleNav] = useState(false);
  const [headerHover, setHeaderHover] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [displaySearchResults, setDisplaySearchResults] = useState(
    results.length > 0
  );

  const showColoredHeader =
    (isEntertainmentLandingPageVisible || !!showSeatMapExperiment) &&
    !hasScrolled &&
    !navActive;

  const [scrollPos, setScrollPos] = useState(0);

  const handleResults = (results: any) => {
    setResults(results);
    setDisplaySearchResults(results.length > 0);
    setResultClicked(false);
  };

  const onEscapePress = () => {
    setDisplaySearchResults(false);
  };

  const onSearchWrapperBlur = (event: FocusEvent) => {
    const isSearchItemClick = resultSectionRef?.current?.contains(
      event.relatedTarget
    );

    if (isSearchItemClick) {
      return;
    }

    setDisplaySearchResults(false);
  };

  const loadSearchPage = () => {
    changePage({ name: PAGETYPE.SEARCH });
  };

  const onSearchResultClick = (
    tgid: any,
    showPageUid: any,
    flowType: string
  ) => {
    const bookingURL = createBookingURL({
      nakedDomain,
      lang,
      tgid,
      redirectToHeadoutBookingFlow,
      flowType,
    });
    const showPageUrl = showPageUid
      ? convertUidToUrl({ uid: showPageUid, hostname: host, lang })
      : bookingURL;

    window.open(showPageUrl ?? bookingURL, '_self', 'noopener');
    setResultClicked(true);
  };

  const allToursArray = Object?.values(allTours);
  const hasDropdownLinks = enableDropdownLinks && dropdownLinks.length;
  const groupedHeaderSlices = groupSlices(
    headerSlices,
    ALLOW_IMMEDIATE_NESTING,
    uid
  );
  const headerCurrencies = useRecoilValue(currencyListAtom);
  const pageMetaData = useRecoilValue(metaAtom);
  const headerLanguages = languageProps?.languages.length
    ? [...(languageProps?.languages ?? []), { code: lang }]
    : [{ code: lang }];

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
  const hamburgerIconCheck =
    !!(
      headerLinks?.filter((link) => link?.link_url)?.length ||
      headerSlices.length
    ) || categoryHeaderMenuExists;

  const [showBuyTickets, setShowBuyTickets] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile);

  useEffect(() => {
    if (!window) return;
    const isMobile = window.innerWidth <= 800;
    setIsMobileDevice(isMobile);
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 20) {
          setHasScrolled(true);
        } else {
          setHasScrolled(false);
        }

        if (window.pageYOffset > 450) {
          setShowBuyTickets(true);
        } else {
          setShowBuyTickets(false);
        }
      },
      { passive: true }
    );
  }, []);

  useEffect(() => {
    if (!window) return;
    const scrollHandler = () => {
      setScrollPos(window.pageYOffset);
    };
    const throttledScrollHandler = throttle(scrollHandler, 500);
    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [scrollPos]);

  const handleHamburgerClick = () => {
    toggleNav((navActive) => !navActive);
    trackEvent({
      eventName: ANALYTICS_EVENTS.HAMBURGER_MENU_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
    });
  };

  useCaptureClickOutside(
    hamburgerRef,
    () => {
      toggleNav(false);
    },
    [multiNavRef]
  );

  return (
    <StyledHeader
      overlayActive={navActive}
      headerHover={headerHover}
      isGlobalMb={isGlobalMb}
      isEntertainmentMb={isEntertainmentMb}
      isCategoryPage={isCategoryPage}
      $isMonthOnMonthPage={isMonthOnMonthPage}
      $isReviewsPage={isReviewsPage}
      $isVenuePage={isVenuePage}
      isEntertainmentMbListicle={isEntertainmentMbListicle}
      showColoredHeader={showColoredHeader}
      isEntertainmentLandingPageVisible={isEntertainmentLandingPageVisible}
      isTop={scrollPos <= 80}
      $categoryHeaderMenuExists={categoryHeaderMenuExists}
      $isPillBarSticky={isPillBarSticky}
      $isEntertainmentBanner={isEntertainmentBanner}
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
            isDarkMode={
              (isEntertainmentLandingPageVisible || showSeatMapExperiment) &&
              showColoredHeader
            }
          >
            <a href={logoRedirectionURL || '/'}>
              <div className="header-logo">
                <Image
                  url={logoUrl}
                  alt={logoAltText}
                  priority
                  height={isMobileDevice ? '22' : '44'}
                  width={isMobileDevice ? '87' : '144'}
                  className="center"
                />
                <Conditional if={hasPoweredByHeadoutLogo}>
                  <span className="poweredBy">
                    <PoweredByHeadout />
                  </span>
                </Conditional>
              </div>
            </a>
            <Conditional if={!isMobileDevice && hasDropdownLinks}>
              <div className="header-links">
                <ResponsiveSelector
                  options={dropdownLinks}
                  onChange={(option: any) =>
                    (window.location.href = option.value)
                  }
                  customClassName="header-city-selector"
                />
              </div>
            </Conditional>
            <Conditional if={!isMobileDevice && enableSearch}>
              <SearchWrapper
                showColoredHeader={showColoredHeader}
                onBlur={onSearchWrapperBlur}
              >
                <SearchBox
                  onEscapePress={onEscapePress}
                  isMobile={isMobileDevice}
                  handleResults={handleResults}
                  allToursArray={allToursArray}
                  clearSearch={resultClicked}
                  isEntertainmentMb={isEntertainmentMb}
                  isEntertainmentLandingPageVisible={
                    isEntertainmentLandingPageVisible
                  }
                  isDarkMode={showColoredHeader}
                />
                <Conditional if={displaySearchResults}>
                  <div>
                    <div className="results" ref={resultSectionRef}>
                      {results.map(
                        ({ item }: { item: Record<string, any> }) => {
                          return (
                            <SearchItem
                              key={item.tgid}
                              {...item}
                              onSearchResultClick={onSearchResultClick}
                            />
                          );
                        }
                      )}
                    </div>
                  </div>
                </Conditional>
              </SearchWrapper>
            </Conditional>
          </HeaderLeft>
          <HeaderRight
            onMouseEnter={() => setHeaderHover(true)}
            onMouseLeave={() => setHeaderHover(false)}
            isDarkMode={showColoredHeader}
            isLtt={isEntertainmentLandingPageVisible}
          >
            <Conditional if={!groupedHeaderSlices.length && headerLinks}>
              <HeaderLinks
                headerLinks={headerLinks}
                isMobile={isMobileDevice}
                hiddenMobile={navActive}
              />
            </Conditional>

            <Conditional if={groupedHeaderSlices.length}>
              <div ref={multiNavRef}>
                <MultiLevelNav
                  isActive={navActive}
                  isMobile={isMobileDevice}
                  slice={groupedHeaderSlices || []}
                  oldMenuItems={convertedRegularMenuItems}
                  isGlobalMb={isGlobalMb}
                  primaryCity={primaryCity}
                  taggedCity={taggedCity}
                  categoryHeaderMenu={categoryHeaderMenu}
                  categoryHeaderMenuExists={categoryHeaderMenuExists}
                  isDarkMode={showColoredHeader}
                />
              </div>
            </Conditional>
            <Conditional if={enableBuyTickets}>
              <Conditional if={isGlobalMb && showBuyTickets}>
                <a href={buyTicketsLink} className="buy-tickets global-mb">
                  {strings.BANNER_CTA}
                </a>
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
                {SearchIcon}
              </div>
            </Conditional>
            <Conditional
              if={headerLanguages?.length || headerCurrencies?.length}
            >
              <LocaleSelector
                languages={headerLanguages}
                currencies={headerCurrencies}
                currentLanguage={lang}
                hasLanguageDropdown={hasLanguageSelector}
                hasCurrencySelector={hideCurrencySelector}
                isDarkMode={showColoredHeader}
                isMobile={isMobile}
              />
            </Conditional>
            <Conditional if={isMobileDevice && hamburgerIconCheck}>
              <div ref={hamburgerRef}>
                <Hamburger
                  className={'hamburger'}
                  isActive={navActive}
                  onClickFn={handleHamburgerClick}
                  isGlobalMb={isGlobalMb}
                  isLtt={isEntertainmentLandingPageVisible}
                  isDarkMode={showColoredHeader}
                />
              </div>
            </Conditional>
          </HeaderRight>
        </header>
      </div>
    </StyledHeader>
  );
};

export default Header;
