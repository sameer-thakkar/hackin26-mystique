import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  ComponentType,
} from 'react';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { MBContext } from 'contexts/MBContext';
import HeaderLinks from 'components/HeaderLinks';
import LanguageSelector from 'components/common/LanguageSelector';
import Conditional from 'components/common/Conditional';
import CurrencySelector from 'components/common/CurrencySelector';
import Hamburger from 'UI/Hamburger';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { POWERED_BY_HEADOUT } from 'assets/SvgIcons';
import { throttle, withTrailingSlash } from 'utils/helper';

const MultiLevelNav = dynamic(() => import('components/MultiLevelNav'));
const ResponsiveSelector: ComponentType<any> = dynamic(
  () =>
    import('components/MicrositeV2/ResponsiveSelector').then(
      (m) => m.ResponsiveSelector
    ),
  { ssr: false }
);

const StyledHeader = styled.header`
  height: 80px;
  position: sticky;
  top: 0;
  width: 100%;
  background-color: ${({ theme: { primaryBackground } }) =>
    primaryBackground ? primaryBackground : '#fff'};
  display: flex;
  left: 0;
  right: 0;
  z-index: 4;
  ${({ hasShadow }) =>
    hasShadow
      ? `
    box-shadow: 0 1px 1em 0 rgba(0,0,0,.1);
  `
      : ''};
  @media (max-width: 768px) {
    height: 56px;
  }
`;

const StyledHeaderContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  ${({ hasDropdownLinks }) =>
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

const StyledLogo = styled.div(
  ({ isEntertainmentMB }) => `
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 10px;
  align-items: center;
  justify-self: left;
  justify-content: left;
  max-width: 350px;
  img {
    height: ${isEntertainmentMB ? `36px` : `44px`};
    max-width: 100%;
    width: unset;
    object-fit: contain;
  }
  svg {
    height: ${isEntertainmentMB ? `36px` : `44px`};
    width: 113px;
  }
  @media (max-width: 768px) {
    display: grid;
    grid-auto-flow: column;
    margin-left: 15px;
    img{
      height: ${isEntertainmentMB ? `20px` : `26px`};
    }
    svg {
      height: ${isEntertainmentMB ? `20px` : `26px`};
      width: 67px;
    }
  }
`
);

const StyledHeaderElements = styled.div`
  justify-self: right;
  display: flex;
  align-items: center;
  * {
    color: ${({ theme: { primaryBGText } }) =>
      primaryBGText ? primaryBGText : COLORS.GRAY.G2};
  }
  ${(props) => {
    if (props.active) {
      return `
      @media (max-width: 768px) {
        margin-right: 55px;
        `;
    }
  }};
  @media (max-width: 768px) {
    * {
      color: ${COLORS.GRAY.G2};
    }
  }
`;

const StyledMenuItem = styled.div`
  margin-left: 24px;
  font-size: 16px;
  font-family: ${HALYARD.FONT_STACK};
  color: ${({ color }) => color || COLORS.BRAND.PURPS};
  text-decoration: none;
  cursor: pointer;
  @media (max-width: 768px) {
    margin-left: 16px;
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
    uid,
    isMobile,
    showGroupBooking = false,
    enableBuyTickets = 'No',
    logoRedirectionURL,
    showTicketRedirectionURL,
    host,
    hasPoweredByHeadoutLogo,
    openGroupBookingModal,
    slices = [],
    hasDropdownLinks,
    dropdownLinks,
    showTicketMenu,
    isAmp,
    headerCurrencies,
    currentCurrency,
    isEntertainmentMB = false,
  } = props;
  const hamburgerIconCheck =
    showGroupBooking ||
    !!headerLinks?.filter((link) => link.link_url?.url)?.length ||
    slices.length;
  const hamburgerRef = useRef(null);
  const multiNavRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const { mbTheme } = useContext(MBContext);

  useCaptureClickOutside(
    hamburgerRef,
    () => {
      setHamburgerOpen(false);
    },
    [multiNavRef]
  );

  const convertedRegularMenuItems =
    headerLinks
      ?.filter((link) => link.link_url?.url)
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

  if (showGroupBooking)
    convertedRegularMenuItems.push({
      slice_type: 'group_booking',
      action: () => {
        openGroupBookingModal();
      },
      toggleMenu: () => setHamburgerOpen((c) => !c),
    });

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
  }, []);

  return (
    <StyledHeader hasShadow={scrollPos > 60}>
      <StyledHeaderContainer hasDropdownLinks={!isMobile && hasDropdownLinks}>
        <a href={logoRedirectionURL || '/'}>
          <StyledLogo isEntertainmentMB={isEntertainmentMB}>
            <Image
              url={logoUrl}
              alt={logoAltText}
              dontLazyLoad
              isLogo
              height="44"
              width="144"
              autoCrop={false}
              isHeaderLogo
            />
            {hasPoweredByHeadoutLogo ? POWERED_BY_HEADOUT : null}
          </StyledLogo>
        </a>
        <Conditional if={!isMobile && hasDropdownLinks}>
          <div className="header-links">
            <ResponsiveSelector
              options={dropdownLinks}
              onChange={(option) => (window.location.href = option.value)}
              customClassName="header-city-selector"
            />
          </div>
        </Conditional>
        <StyledHeaderElements active={hamburgerIconCheck}>
          <div ref={hamburgerRef}>
            <Conditional if={isMobile && hamburgerIconCheck}>
              <div
                onClick={() => {
                  setHamburgerOpen((c) => !c);
                }}
                tabIndex={0}
                role="button"
              >
                <Hamburger isActive={hamburgerOpen} />
              </div>
            </Conditional>
            <Conditional if={!slices && headerLinks}>
              <HeaderLinks
                headerLinks={headerLinks}
                openGroupBookingModal={openGroupBookingModal}
                isMobile={isMobile}
                showGroupBooking={showGroupBooking}
                hiddenMobile={hamburgerOpen}
              />
            </Conditional>
          </div>
          <Conditional if={slices}>
            <span ref={multiNavRef}>
              <MultiLevelNav
                isMobile={isMobile}
                isActive={hamburgerOpen}
                slice={slices.filter(
                  (slice) => slice.slice_type === 'navigation'
                )}
                oldMenuItems={convertedRegularMenuItems}
              />
            </span>
          </Conditional>
          <Conditional if={enableBuyTickets === 'Yes'}>
            <StyledMenuItem
              onClick={() => {
                scroller.scrollTo('tour-list-heading', {
                  duration: 1200,
                  offset: isMobile ? -80 : -100,
                  smooth: 'easeInOutQuart',
                });
              }}
            >
              {strings.BANNER_CTA}
            </StyledMenuItem>
          </Conditional>
          <Conditional if={showTicketMenu}>
            <StyledMenuItem as="a" href={showTicketRedirectionURL}>
              {strings.TICKETS}
            </StyledMenuItem>
          </Conditional>
          <Conditional if={languages?.length}>
            <LanguageSelector
              languages={languages}
              currentLanguage={currentLanguage}
              uid={uid}
              host={host}
              isMobile={isMobile}
              mbTheme={mbTheme}
              isAmp={isAmp}
            />
          </Conditional>
          <Conditional if={headerCurrencies?.length}>
            <CurrencySelector
              currentCurrency={currentCurrency}
              currencies={headerCurrencies}
              isMobile={isMobile}
              isAmp={isAmp}
              host={host}
            />
          </Conditional>
        </StyledHeaderElements>
      </StyledHeaderContainer>
    </StyledHeader>
  );
};

export default Header;
