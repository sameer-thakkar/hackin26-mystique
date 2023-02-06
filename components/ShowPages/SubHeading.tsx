import { expandFontToken } from 'const/typography';
import React from 'react';
import styled from 'styled-components';

const SubHeadingText = styled.h2`
  margin-top: 64px !important;
  margin-bottom: 24px !important;
  ${expandFontToken('Heading/Large')}

  @media (max-width: 768px) {
    ${expandFontToken('Heading/Small')}
    margin-top: 48px !important;
  }
`;

const SubHeading = ({
  content
}: any) => {
  return <SubHeadingText>{content}</SubHeadingText>;
};

export default SubHeading;
