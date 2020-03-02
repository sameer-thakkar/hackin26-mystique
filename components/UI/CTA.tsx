import React from 'react';
import styled from 'styled-components';
import { COLORS, AVENIR } from '../../constants/ui-constants';

const StyledCTA = styled.div`
  cursor: pointer;
  width: calc(100% - 32px);
  padding: 16px;
  text-align: center;
  border-radius: 2px;
  color: ${COLORS.RHAPSODY};
  font-family: ${AVENIR.FONT_STACK};
  text-align: center;
  font-weight: ${AVENIR.HEAVY};
  line-height: 16px;
  a {
    text-decoration: none;
    color: ${COLORS.WHITE};
  }
  ${({ bordered }) =>
    (bordered
      ? `
    border: 1px solid ${COLORS.RHAPSODY};
    a {
      color: ${COLORS.RHAPSODY};
    }
  `
      : `background: ${COLORS.RHAPSODY}`) + ';'}
`;

const CommonCTA = props => {
  const { text, link, clickHandler, children } = props;

  return (
    <StyledCTA onClick={clickHandler} {...props}>
      {link ? (
        <a href={link.url} target={link.target}>
          {children}
        </a>
      ) : (
        children
      )}
    </StyledCTA>
  );
};

export default CommonCTA;
