import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import LinkResolver from './LinkResolver';
import { COLORS } from '../constants/ui-constants';

const StyledHeaderLinksWrapper = styled.div`
  display: flex;
  text-decoration: none;
  div,
  a {
    margin-right: 32px;
    color: ${COLORS.DAVY_GREY};
    font-family: Graphik;
    font-size: 16px;
    cursor: pointer;
    color: ${COLORS.DAVY_GREY};
    text-decoration: none;
    :hover {
      color: #ec1943;
    }
    :last-child {
      margin-right: 0px;
    }
  }
  @media (max-width: 768px) {
    display: ${props => {
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
      font-family: Avenir;
    }
  }
`;

const HeaderLinks: React.FC<any> = ({
  headerLinks,
  showGroupBooking,
  dropdown,
  openGroupBookingModal,
}) => {
  return (
    <StyledHeaderLinksWrapper show={dropdown.hamburger}>
      {headerLinks.map((link, index) => (
        <LinkResolver target="_blank" url={link.link_url.url} key={index}>
          {link.link_heading}
        </LinkResolver>
      ))}
      {showGroupBooking && (
        <div onClick={openGroupBookingModal}>Group Tickets</div>
      )}
    </StyledHeaderLinksWrapper>
  );
};

export default HeaderLinks;
