import React from 'react';
import styled from 'styled-components';
import { strings } from 'const/strings';
import { SOLEIL } from 'const/ui-constants';

import { CIRCLE_TICK } from '../../assets/SvgIcons';

const WhyBookFromUsWrapper = styled.div`
  width: 384px;
  height: max-content;
  background: #f8f6ff;
  border-radius: 4px;
  padding: 24px 24px 20px 24px;
  font-family: ${SOLEIL.FONT_STACK};
`;

const Heading = styled.div`
  font-weight: ${SOLEIL.MEDIUM};
  font-size: 24px;
  line-height: 28px;
  margin-bottom: 24px;
`;

const TextLine = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
  grid-column-gap: 12px;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 12px;
  svg {
    margin-top: 4px;
  }
  :last-child {
    margin-bottom: 0;
  }
`;

const WhyBookFromUs: React.FC<{
  data: { text_line: string }[];
}> = ({ data }) => {
  return (
    <WhyBookFromUsWrapper>
      <Heading>{strings.LISTICLES.WHY_BOOK_FROM_US}</Heading>
      {data.map(({ text_line: textLine }, index) => {
        return (
          <TextLine key={index}>
            {CIRCLE_TICK}
            {textLine.substring(0, 80)}
          </TextLine>
        );
      })}
    </WhyBookFromUsWrapper>
  );
};

export default WhyBookFromUs;
