import React, { ComponentType, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styled, { css } from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import DeferredComponent from 'components/common/DeferredComponent';
import LocaleSelector from 'components/common/LocaleSelector';
import HeaderLinks from 'components/HeaderLinks';
import Hamburger from 'UI/Hamburger';
import Image from 'UI/Image';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { throttle } from 'utils/gen';
import { withTrailingSlash } from 'utils/helper';
import { appAtom } from 'store/atoms/app';
import { currencyListAtom } from 'store/atoms/currencyList';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import PoweredByHeadout from 'assets/poweredByHeadout';
import PoweredByHeadoutNoBorder from 'assets/poweredByHeadoutNoBorder';

const MultiLevelNav = dynamic(() => import('components/MultiLevelNav'));
const ResponsiveSelector: ComponentType<any> = dynamic(
  () =>
    import('components/MicrositeV2/ResponsiveSelector').then(
      (m) => m.ResponsiveSelector
    ),
  { ssr: false }
);
const RiveLogoComponent = dynamic(
  () => import('components/common/RiveLogoComponent/index'),
  { ssr: false }
);

const StyledHeader = styled.header<{
  $isSticky: boolean;
  $isTop: boolean;
  $isEntertainmentMB: boolean;
  $isPillBarSticky: boolean;
  $isAirportTransfersMB: boolean;
}>`
  height: 80px;
  width: 100%;
  background-color: ${({ theme: { primaryBackground } }) =>
    primaryBackground ? primaryBackground : '#fff'};
  display: flex;
  z-index: 11;
  transition: all 0.2s ease-in;
  position: sticky;
  top: 0;
  box-shadow: ${({
    $isTop,
    $isEntertainmentMB,
    $isSticky,
    $isPillBarSticky,
    $isAirportTransfersMB,
  }) =>
    !$isTop &&
    !$isEntertainmentMB &&
    !$isPillBarSticky &&
    $isSticky &&
    !$isAirportTransfersMB &&
    '0px -1px 2px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.12)'};

  :hover {
    z-index: 99;
  }

  ${({ $isSticky, $isEntertainmentMB }) =>
    !$isSticky &&
    !$isEntertainmentMB &&
    `
    top: -5rem;
    left: 0;
    right: 0;
`}

  @media (max-width: 768px) {
    height: 56px;

    ${({ $isSticky, $isEntertainmentMB }) =>
      !$isSticky &&
      !$isEntertainmentMB &&
      `
      top: -3.5rem;
    `}

    ${({ $isPillBarSticky }) =>
      $isPillBarSticky &&
      `
      box-shadow: none;
    `}

    ${({ $isEntertainmentMB, $isPillBarSticky, $isAirportTransfersMB }) =>
      ($isEntertainmentMB || $isPillBarSticky || $isAirportTransfersMB) &&
      `border-bottom: 1px solid ${COLORS.GRAY.G6};`}
  }
`;

const StyledHeaderContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  ${({
    // @ts-expect-error TS(2339): Property 'hasDropdownLinks' does not exist on type... Remove this comment to see the full error message
    hasDropdownLinks,
  }) =>
    hasDropdownLinks
      ? ` 
      grid-template-columns: auto auto 1fr;
      grid-column-gap: 24px;
    `
      : ``};
  width: calc(100% - (5.46vw * 2));
  margin: auto;
  max-width: 1200px;
  margin: auto;
  align-items: center;
  .header-city-selector {
    min-width: 180px;
  }
  .header-city-selector .current-selection {
    border-radius: 4px;
    padding: 12px 15px;
    border: 1px solid ${({ theme }) => theme.primaryBGColor || COLORS.GRAY.G6};
  }
  @media (max-width: 768px) {
    height: 56px;
    width: 100%;
  }
`;

const StyledLogo = styled.div<{
  isEntertainmentMB: boolean;
}>(
  ({ isEntertainmentMB }) => css`
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-self: left;
    justify-content: left;
    max-width: 350px;
    height: 2rem !important;

    .center {
      display: flex;
      padding-top: 0.25rem;
    }

    .image-wrap {
      padding-right: 7px;
      span {
        position: relative !important;
      }
      img {
        height: ${isEntertainmentMB ? `2.25rem` : `2.5rem`} !important;
        position: relative !important;
        max-width: ${isEntertainmentMB ? '10.625rem' : '100%'};
        width: unset !important;
        object-fit: contain;
        padding-top: ${isEntertainmentMB && `4.5px`};
      }
    }

    svg {
      height: ${isEntertainmentMB ? `2.25rem` : `2.5rem`};
      width: auto;
      margin-left: ${isEntertainmentMB ? '-1px' : '11px'};
    }

    @media (max-width: 768px) {
      display: grid;
      grid-auto-flow: column;
      margin-left: 1.5rem;

      .image-wrap {
        padding-right: 0;
        img {
          height: ${isEntertainmentMB ? `20px` : `26px`} !important;
        }
      }

      svg {
        height: ${isEntertainmentMB ? `20px` : `26px`};
        width: 67px;
      }
    }
  `
);

const StyledHeaderElements = styled.div<{
  active: boolean;
}>`
  justify-self: right;
  display: flex;
  align-items: center;
  column-gap: 8px;
  * {
    color: ${({ theme: { primaryBGText } }) =>
      primaryBGText ? primaryBGText : COLORS.GRAY.G2};
  }

  @media (max-width: 768px) {
    margin-right: 24px;
    * {
      color: ${COLORS.GRAY.G2};
    }
  }
`;

const StyledVerticalDivider = styled.div`
  border-left: 0.063rem solid ${COLORS.LIGHT_GRAY};
  height: 2.5rem;
  margin-left: 0.375rem;

  @media (max-width: 768px) {
    height: 1.625rem;
    padding-bottom: 0.25rem;
  }
`;

const StyledMenuItem = styled.div`
  margin-left: 24px;
  font-size: 15px;
  font-family: ${HALYARD.FONT_STACK};
  color: ${({ color }) => color || COLORS.BRAND.PURPS};
  text-decoration: none;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  &:hover {
    background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
  }
  @media (max-width: 768px) {
    margin-left: 16px;
  }
`;

const LogoPlaceholderWrapper = styled.div`
  display: flex;
  svg {
    height: 1.9rem;
  }

  @media (max-width: 768px) {
    svg {
      height: 1.4rem;
    }
  }
`;

const Header: React.FC<any> = (props) => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const {
    languages,
    headerLinks,
    currentLanguage,
    logoUrl,
    logoAltText,
    isMobile,
    showGroupBooking = false,
    logoRedirectionURL,
    showTicketRedirectionURL,
    hasPoweredByHeadoutLogo,
    openGroupBookingModal,
    slices = [],
    hasDropdownLinks,
    dropdownLinks,
    showTicketMenu,
    isEntertainmentMB = false,
    primaryCity,
    taggedCity,
    categoryHeaderMenu,
    categoryHeaderMenuExists = false,
    isAirportTransfersMB = false,
    hideLangCurrencySelector = false,
  } = props;
  const headerCurrencies = useRecoilValue(currencyListAtom);
  const pageMetaData = useRecoilValue(metaAtom);
  const headerLanguages = languages?.length
    ? [...languages, { code: currentLanguage }]
    : [{ code: currentLanguage }];

  const { isSidenavScroll, isPillBarSticky } = useRecoilValue(appAtom);
  const hamburgerIconCheck = categoryHeaderMenuExists
    ? Object.keys(categoryHeaderMenu).length > 0
    : showGroupBooking ||
      !!headerLinks?.filter((link: any) => link.link_url?.url)?.length ||
      slices.length;

  const hamburgerRef = useRef(null);
  const multiNavRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [appState, setAppState] = useRecoilState(appAtom);

  useCaptureClickOutside(
    hamburgerRef,
    () => {
      setHamburgerOpen(false);
    },
    [multiNavRef]
  );

  const convertedRegularMenuItems =
    headerLinks
      ?.filter((link: any) => link.link_url?.url)
      ?.map((link: any) => ({
        slice_type: 'menu_item',

        primary: {
          label: link.link_heading,
          url: {
            url: withTrailingSlash(link?.link_url?.url),
            target: link.link_url.target,
          },
        },
      })) || [];

  if (showGroupBooking)
    convertedRegularMenuItems.push({
      slice_type: 'group_booking',
      action: () => {
        openGroupBookingModal();
      },
      toggleMenu: () => setHamburgerOpen((hamburgerOpen) => !hamburgerOpen),
    });

  useEffect(() => {
    if (!window) return;
    const scrollHandler = () => {
      setScrollPos(window.pageYOffset);
      if (categoryHeaderMenuExists) {
        setIsHeaderSticky(isMobile ? true : false);
      } else {
        const isUpScroll = scrollPos > window.pageYOffset;
        setIsHeaderSticky(isUpScroll);
      }
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
    setHamburgerOpen((hamburgerOpen) => !hamburgerOpen);
    trackEvent({
      eventName: ANALYTICS_EVENTS.HAMBURGER_MENU_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
    });
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      if (isSidenavScroll) {
        setAppState({ ...appState, isSidenavScroll: false });
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isSidenavScroll]);

  return (
    <StyledHeader
      $isSticky={isHeaderSticky}
      $isTop={scrollPos <= 80}
      $isEntertainmentMB={isEntertainmentMB}
      $isAirportTransfersMB={isAirportTransfersMB}
      $isPillBarSticky={isPillBarSticky}
    >
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <StyledHeaderContainer hasDropdownLinks={!isMobile && hasDropdownLinks}>
        <a href={logoRedirectionURL || '/'}>
          <StyledLogo isEntertainmentMB={isEntertainmentMB}>
            <Image
              url={logoUrl}
              alt={logoAltText}
              priority
              fill
              height="40"
              width="130"
              autoCrop={false}
              className="center"
              fetchPriority="high"
            />
            <Conditional if={hasPoweredByHeadoutLogo && !isEntertainmentMB}>
              <StyledVerticalDivider />
              <DeferredComponent
                renderPlaceholder={
                  <LogoPlaceholderWrapper>
                    <PoweredByHeadoutNoBorder />
                  </LogoPlaceholderWrapper>
                }
                delay={5000}
              >
                <RiveLogoComponent />
              </DeferredComponent>
            </Conditional>
            <Conditional if={hasPoweredByHeadoutLogo && isEntertainmentMB}>
              <PoweredByHeadout />
            </Conditional>
          </StyledLogo>
        </a>
        <Conditional if={!isMobile && hasDropdownLinks}>
          <div className="header-links">
            <ResponsiveSelector
              options={dropdownLinks}
              onChange={(option: any) => (window.location.href = option.value)}
              customClassName="header-city-selector"
            />
          </div>
        </Conditional>
        <StyledHeaderElements active={hamburgerIconCheck}>
          <Conditional if={!slices && headerLinks}>
            <HeaderLinks
              headerLinks={headerLinks}
              openGroupBookingModal={openGroupBookingModal}
              isMobile={isMobile}
              showGroupBooking={showGroupBooking}
              hiddenMobile={hamburgerOpen}
            />
          </Conditional>
          <Conditional if={slices}>
            <span ref={multiNavRef}>
              <MultiLevelNav
                isMobile={isMobile}
                isActive={hamburgerOpen}
                slice={slices.filter(
                  (slice: any) => slice.slice_type === 'navigation'
                )}
                oldMenuItems={convertedRegularMenuItems}
                primaryCity={primaryCity}
                taggedCity={taggedCity}
                categoryHeaderMenu={categoryHeaderMenu}
                categoryHeaderMenuExists={categoryHeaderMenuExists}
              />
            </span>
          </Conditional>
          <Conditional if={showTicketMenu}>
            <StyledMenuItem
              as="a"
              href={showTicketRedirectionURL}
              onClick={() =>
                trackEvent({
                  eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
                  [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.TICKETS,
                })
              }
            >
              {strings.TICKETS}
            </StyledMenuItem>
          </Conditional>

          <Conditional
            if={
              !hideLangCurrencySelector &&
              (headerCurrencies?.length || headerLanguages?.length)
            }
          >
            <LocaleSelector
              currencies={headerCurrencies}
              languages={headerLanguages}
              currentLanguage={currentLanguage}
              isMobile={isMobile}
            />
          </Conditional>
          <Conditional if={isMobile && hamburgerIconCheck}>
            <div
              ref={hamburgerRef}
              onClick={handleHamburgerClick}
              tabIndex={0}
              role="button"
            >
              <Hamburger isActive={hamburgerOpen} />
            </div>
          </Conditional>
        </StyledHeaderElements>
      </StyledHeaderContainer>
    </StyledHeader>
  );
};

export default Header;
