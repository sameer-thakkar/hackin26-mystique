import React, { useRef, useState, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import LanguageSelector from './LanguageSelector';
import HeaderLinks from '../HeaderLinks';
import Hamburger from '../UI/Hamburger';
import Image from '../UI/Image';
import { useCaptureClickOutside } from '../hooks/ClickOutside';
import { POWERED_BY_HEADOUT } from '../../public/static/svg-icons';
import { DROPDOWN_ELEMENT } from '../../constants';
import MultiLevelNav from '../MultiLevelNav';

const StyledHeader = styled.header`
  height: 80px;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
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
  background-color: rgba(255, 255, 255, 1);
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
  ${(props) => {
    if (props.active) {
      return `
      @media (max-width: 768px) {
        margin-right: 60px;
        `;
    }
  }}
`;

const StyledBuyTickets = styled.div`
  margin-left: 32px;
  font-size: 16px;
  font-family: Graphik;
  color: red;
  text-decoration: none;
  cursor: pointer;
  @media (max-width: 768px) {
    margin: 0 20px;
  }
`;

const Header: React.FC<any> = (props) => {
  const {
    languages,
    headerLinks,
    currentLanguage,
    logoUrl,
    logoAltText,
    alternateLanguages,
    uid,
    dropdown,
    handleDropdownToggle,
    isMobile,
    showGroupBooking = false,
    hasLanguageSelector = 'No',
    enableBuyTickets = 'No',
    logoRedirectionURL,
    host,
    hasPoweredByHeadoutLogo,
    openGroupBookingModal,
    slices = [],
  } = props;
  const hamburgerIconCheck = showGroupBooking || !!headerLinks?.length;
  const someRef = useRef(null);
  const multiNavRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  useCaptureClickOutside(
    someRef,
    () => {
      handleDropdownToggle(DROPDOWN_ELEMENT.HAMBURGER, false);
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
      toggleMenu: () => handleDropdownToggle(DROPDOWN_ELEMENT.HAMBURGER),
    });

  useLayoutEffect(() => {
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
          <div ref={someRef}>
            {isMobile && hamburgerIconCheck ? (
              <div
                onClick={() => {
                  handleDropdownToggle(DROPDOWN_ELEMENT.HAMBURGER);
                }}
                role="button"
                tabIndex={0}
              >
                <Hamburger isActive={dropdown.hamburger} />
              </div>
            ) : null}
            {!slices && headerLinks ? (
              <HeaderLinks
                headerLinks={headerLinks}
                openGroupBookingModal={openGroupBookingModal}
                isMobile={isMobile}
                showGroupBooking={showGroupBooking}
                dropdown={dropdown}
                handleDropdownToggle={handleDropdownToggle}
              />
            ) : null}
          </div>
          {slices ? (
            <span ref={multiNavRef}>
              <MultiLevelNav
                isMobile={isMobile}
                isActive={dropdown.hamburger}
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
              Buy Tickets
            </StyledBuyTickets>
          ) : null}
          {hasLanguageSelector === 'Yes' ? (
            <LanguageSelector
              languages={languages}
              alternateLanguages={alternateLanguages}
              currentLanguage={currentLanguage}
              uid={uid}
              host={host}
              isMobile={isMobile}
            />
          ) : null}
        </StyledHeaderElements>
      </StyledHeaderContainer>
    </StyledHeader>
  );
};

export default Header;
