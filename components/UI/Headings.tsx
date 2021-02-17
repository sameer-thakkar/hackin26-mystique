import React from 'react';
import styled from 'styled-components';
import { SOLEIL } from 'const/ui-constants';

export const StyledTopHeading = styled.div`
  font-size: 35px;
  font-weight: 500;
  font-family: ${SOLEIL.FONT_STACK};
  color: #000000;
  border-left: 3px solid #669dde;
  padding: 5px 20px 5px;
`;

export const TopHeading = ({ h1 = false, children }) => {
  return (
    <StyledTopHeading {...(h1 && { as: 'h1' })}>{children}</StyledTopHeading>
  );
};

export const SubHeading = styled.h2`
  font-weight: 600;
  font-size: 20px !important;
  color: #545454;
  margin-top: 20px;
  margin-bottom: 20px;
`;
