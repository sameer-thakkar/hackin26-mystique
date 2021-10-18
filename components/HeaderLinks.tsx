import React from 'react';
import styled from 'styled-components';
import { strings } from 'const/strings';
import { COLORS, SOLEIL } from 'const/ui-constants';

import LinkResolver from './LinkResolver';

const StyledHeaderLinksWrapper = styled.div`
  display: flex;
  text-decoration: none;
  div,
  a {
    margin-right: 32px;
    color: ${COLORS.DAVY_GREY};
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    cursor: pointer;
    color: ${COLORS.DAVY_GREY};
    text-decoration: none;
    :hover {
      color: ${COLORS.PURPS};
    }
    :last-child {
      margin-right: 0px;
    }
  }
  .group-booking-cta {
    padding: 12px 16px;
    border: 1px solid;
    border-radius: 4px;
    line-height: 16px;
  }
  @media (max-width: 768px) {
    display: ${(props) => {
      if (!props.show) {
        return `none`;
      }
      return 'block';
    }};
    position: fixed;
    right: 2%;
    top: 56px;
    box-shadow: 0px 10px 12px -4px rgba(33, 33, 33, 0.15);
    a,
    div {
      margin-right: 0px;
      background-color: #ffffff;
      display: block;
      padding: 10px 25px;
      text-align: center;
      border-bottom: 0.5px dotted #d8d8d8;
      font-family: ${SOLEIL.FONT_STACK};
    }
    .group-booking-cta {
      padding: 0;
      border: none;
    }
  }
`;

const HeaderLinks: React.FC<any> = ({
  hiddenMobile = false,
  headerLinks,
  showGroupBooking,
  openGroupBookingModal,
}) => {
  return (
    <StyledHeaderLinksWrapper show={hiddenMobile}>
      {headerLinks.map((link, index) => (
        <LinkResolver target="_blank" url={link.link_url.url} key={index}>
          {link.link_heading}
        </LinkResolver>
      ))}
      {showGroupBooking && (
        <div
          className="group-booking-cta"
          onClick={openGroupBookingModal}
          role="button"
          tabIndex={0}
        >
          {strings.GROUP_TICKETS}
        </div>
      )}
    </StyledHeaderLinksWrapper>
  );
};

export default HeaderLinks;
