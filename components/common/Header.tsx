import React, { useRef } from 'react';
import styled from 'styled-components';
import LanguageSelector from './LanguageSelector';
import HeaderLinks from '../HeaderLinks';
import Hamburger from '../UI/Hamburger';
import Image from '../UI/Image';
import { useCaptureClickOutside } from '../hooks/ClickOutside';
import { POWERED_BY_HEADOUT } from '../../public/static/svg-icons';
import { DROPDOWN_ELEMENT } from '../../constants';

const StyledHeader = styled.header`
  height: 68px;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 12px 2px rgba(33, 33, 33, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  left: 0;
  right: 0;
  z-index: 2;
  @media (max-width: 768px) {
    height: 56px;
  }
`;

const StyledHeaderContainer = styled.div`
  max-width: 1200px;
  height: 68px;
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
    height: 36px;
  }
  svg {
    height: 36px;
  }
  @media (max-width: 768px) {
    display: grid;
    grid-auto-flow: column;
    margin-left: 15px;
    img {
      height: 26px;
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
  margin: 0 15px;
  font-size: 14px;
  text-transform: uppercase;
  font-family: Avenir;
  a {
    color: red;
    text-decoration: none;
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
  const hamburgerIconCheck = showGroupBooking ?? headerLinks?.length;
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
            <StyledBuyTickets>
              <a href="#select-tickets">Buy Tickets</a>
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
