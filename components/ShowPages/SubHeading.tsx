import React from 'react';
import styled from 'styled-components';

const SubHeadingText = styled.h2`
  margin-top: 64px !important;
  margin-bottom: 24px !important;

  font-size: 24px;
  @media (max-width: 768px) {
    font-size: 18px;
    margin-top: 48px !important;
  }
`;

const SubHeading = ({ content }) => {
  return <SubHeadingText>{content}</SubHeadingText>;
};

export default SubHeading;
