import React, { useRef } from 'react';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import LanguageSelector from './LanguageSelector';
import HeaderLinks from '../HeaderLinks';
import Hamburger from '../UI/Hamburger';
import Image from '../UI/Image';
import { useCaptureClickOutside } from '../hooks/ClickOutside';
import { POWERED_BY_HEADOUT } from '../../public/static/svg-icons';
import { DROPDOWN_ELEMENT } from '../../constants';

const StyledHeader = styled.header`
  height: 80px;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  left: 0;
  right: 0;
  z-index: 3;
  @media (max-width: 768px) {
    height: 56px;
  }
`;

const StyledHeaderContainer = styled.div`
  height: 80px;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  left: 0;
  right: 0;
  z-index: 1;
  max-width: 1200px;
  margin: auto;
  @media (max-width: 768px) {
    height: 56px;
  }
`;

const StyledLogo = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 10px;
  align-items: center;
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
  display: flex;
  align-items: center;
  margin-right: 20px;
  ${props => {
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

const Header: React.FC<any> = props => {
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
  } = props;
  const hamburgerIconCheck = showGroupBooking || !!headerLinks?.length;
  const someRef = useRef(null);
  useCaptureClickOutside(
    someRef,
    () => {
      handleDropdownToggle(DROPDOWN_ELEMENT.HAMBURGER, false);
    },
    []
  );

  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <a href={logoRedirectionURL}>
          <StyledLogo>
            <Image url={logoUrl} alt={logoAltText} />
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
              >
                <Hamburger />
              </div>
            ) : null}
            {headerLinks ? (
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
