import * as labels from 'constants/localization/labels';
import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import LanguageSelector from './LanguageSelector';
import HeaderLinks from '../HeaderLinks';
import Hamburger from 'UI/Hamburger';
import Image from 'UI/Image';
import MultiLevelNav from '../MultiLevelNav';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { POWERED_BY_HEADOUT } from 'assets/SvgIcons';
import { SOLEIL, COLORS } from 'constants/ui-constants';
import { MBContext } from 'contexts/MBContext';
import Conditional from './Conditional';

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
  z-index: 3;
  ${({ hasShadow }) =>
    hasShadow
      ? `
    box-shadow: 0 1px 1em 0 rgba(0,0,0,.1);
  `
      : ''}
  @media (max-width: 768px) {
    height: 56px;
  }
`;

const StyledHeaderContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  width: 100%;
  max-width: 1200px;
  margin: auto;
  align-items: center;
  @media (max-width: 768px) {
    height: 56px;
  }
`;

const StyledLogo = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 10px;
  align-items: center;
  justify-self: left;
  justify-content: left;
  img {
    height: 44px;
    max-width: 160px;
  }
  svg {
    height: 44px;
    width: 113px;
  }
  @media (max-width: 768px) {
    display: grid;
    grid-auto-flow: column;
    margin-left: 15px;
    img {
      height: 26px;
    }
    svg {
      height: 26px;
      width: 67px;
    }
  }
`;

const StyledHeaderElements = styled.div`
  justify-self: right;
  display: flex;
  align-items: center;
  margin-right: 20px;
  * {
    color: ${({ theme: { primaryBGText } }) =>
      primaryBGText ? primaryBGText : COLORS.FOUR_BLACK};
  }
  ${(props) => {
    if (props.active) {
      return `
      @media (max-width: 768px) {
        margin-right: 55px;
        `;
    }
  }}
  @media (max-width: 768px) {
    * {
      color: ${COLORS.FOUR_BLACK};
    }
  }
`;

const StyledBuyTickets = styled.div`
  margin-left: 32px;
  font-size: 16px;
  font-family: ${SOLEIL.FONT_STACK};
  color: ${({ color }) => color || COLORS.RHAPSODY};
  text-decoration: none;
  cursor: pointer;
  @media (max-width: 768px) {
    margin-left: 16px;
  }
`;
const StyledMenuItem = styled.div`
  margin-left: 32px;
  font-size: 16px;
  font-family: ${SOLEIL.FONT_STACK};
  color: ${({ theme }) => theme.primaryBGText || COLORS.FOUR_BLACK};
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
    hasLanguageSelector = 'No',
    enableBuyTickets = 'No',
    logoRedirectionURL,
    host,
    hasPoweredByHeadoutLogo,
    openGroupBookingModal,
    slices = [],
    showTicketMenu,
    hideLangugageDropdown,
  } = props;
  const hamburgerIconCheck =
    showGroupBooking || !!headerLinks?.length || slices.length;
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
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }, [scrollPos]);
  return (
    <StyledHeader hasShadow={scrollPos > 60}>
      <StyledHeaderContainer>
        <a href={logoRedirectionURL}>
          <StyledLogo>
            <Image url={logoUrl} alt={logoAltText} dontLazyLoad={true} />
            {hasPoweredByHeadoutLogo ? POWERED_BY_HEADOUT : null}
          </StyledLogo>
        </a>
        <StyledHeaderElements active={hamburgerIconCheck}>
          <div ref={hamburgerRef}>
            {isMobile && hamburgerIconCheck ? (
              <div
                onClick={() => {
                  setHamburgerOpen((c) => !c);
                }}
                role="button"
                tabIndex={0}
              >
                <Hamburger isActive={hamburgerOpen} />
              </div>
            ) : null}
            {!slices && headerLinks ? (
              <HeaderLinks
                headerLinks={headerLinks}
                openGroupBookingModal={openGroupBookingModal}
                isMobile={isMobile}
                showGroupBooking={showGroupBooking}
                hiddenMobile={hamburgerOpen}
              />
            ) : null}
          </div>
          {slices ? (
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
          ) : null}
          {enableBuyTickets === 'Yes' ? (
            <StyledBuyTickets
              onClick={() => {
                scroller.scrollTo('tour-list-heading', {
                  duration: 1200,
                  offset: isMobile ? -80 : -100,
                  smooth: 'easeInOutQuart',
                });
              }}
            >
              {labels[currentLanguage].BANNER_CTA}
            </StyledBuyTickets>
          ) : null}
          <Conditional if={showTicketMenu}>
            <StyledMenuItem as="a" href={logoRedirectionURL}>
              {labels[currentLanguage].TICKETS}
            </StyledMenuItem>
          </Conditional>
          {hasLanguageSelector === 'Yes' && !hideLangugageDropdown ? (
            <LanguageSelector
              languages={languages}
              currentLanguage={currentLanguage}
              uid={uid}
              host={host}
              isMobile={isMobile}
              mbTheme={mbTheme}
            />
          ) : null}
        </StyledHeaderElements>
      </StyledHeaderContainer>
    </StyledHeader>
  );
};

export default Header;
