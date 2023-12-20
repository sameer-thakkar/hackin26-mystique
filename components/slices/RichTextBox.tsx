import React from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import COLORS from 'const/colors';
import { shortCodeSerializer } from '../../utils/shortCodes';

const StyledRichTextBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
  .rich-text-box {
    border: 1px solid ${COLORS.GRAY.G6};
    border-radius: 4px;
    padding: 14px 16px;
  }
  .rich-text-box * {
    margin: 0;
  }
  .rich-text-box h3 {
    margin-bottom: 8px;
  }
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: unset;
    grid-template-rows: 1fr 1fr;
    grid-gap: 40px;
  }
`;
const RichTextBox = (props: any) => {
  return (
    <StyledRichTextBox>
      {props.childSlices.map((block: any, index: number) => (
        <div className="rich-text-box" key={index}>
          <PrismicRichText
            key={index}
            field={block.content}
            components={shortCodeSerializer}
          />
        </div>
      ))}
    </StyledRichTextBox>
  );
};
export default RichTextBox;
