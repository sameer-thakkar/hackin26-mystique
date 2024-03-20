import React, { memo, useState } from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import RichTextCTA from 'UI/RichTextCTA';
import { generateSidenavId } from 'utils/helper';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import ChevronDown from 'assets/chevronDown';

const Wrapper = styled.div<{
  $isExpanded: boolean;
  $contentHeight: number;
}>`
  position: relative;
  .rich-text {
    ${({ $isExpanded, $contentHeight }) =>
      !$isExpanded && `height: ${$contentHeight}px;`}
    ${({ $contentHeight }) => $contentHeight && `margin-bottom: -6px;`}
    ${({ $isExpanded }) => !$isExpanded && `overflow: hidden;`}
  }
  .fadeout {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 100%
    );
    ${({ $isExpanded }) => $isExpanded && `display: none;`}
  }
  .toggle {
    position: absolute;
    button {
      border: none;
      background: none;
      cursor: pointer;
      ${expandFontToken('Paragraph/Large')};
      color: ${COLORS.TEXT.CANDY_1};
      padding: 0;
    }
    svg {
      path {
        stroke: ${COLORS.TEXT.CANDY_1};
      }
      margin-bottom: -2px;
      padding: 0 7px;
      ${({ $isExpanded }) => $isExpanded && ` transform: rotate(180deg);`}
    }
  }
  @media (max-width: 768px) {
    .rich-text {
      height: ${({
        $isExpanded,
        $contentHeight,
        // @ts-expect-error TS(2339): Property '$hasCTA' does not exist on type 'Pick<De... Remove this comment to see the full error message
        $hasCTA,
      }) =>
        $contentHeight && $hasCTA && !$isExpanded
          ? `${2 * $contentHeight}px`
          : '100%'};
      margin-bottom: unset;
    }
  }
`;

const RichtextWithCTA = memo((props: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {props?.childSlices?.map((block: any, index: number) => {
        const {
          content_height: contentHeight,
          cta_text,
          text: textArray,
        } = block || {};
        const idArray = textArray?.reduce(
          (acc: Array<string>, el: TRichTextArray) => {
            if (el?.type === 'heading2') {
              acc.push(generateSidenavId(el?.text));
            }
            return acc;
          },
          []
        );

        return (
          <Wrapper
            key={index}
            $isExpanded={isExpanded}
            $contentHeight={contentHeight}
            // @ts-expect-error TS(2769): No overload matches this call.
            $hasCTA={cta_text}
          >
            <div className="rich-text" id={idArray?.[0]}>
              <PrismicRichText
                field={textArray}
                components={shortCodeSerializer}
              />
            </div>
            <Conditional if={cta_text}>
              <RichTextCTA {...block} />
            </Conditional>
            <Conditional if={contentHeight}>
              <div className="fadeout" />
              <span className="toggle">
                <button onClick={handleClick} className="view-more">
                  {isExpanded ? strings.SHOW_LESS_TEXT : strings.VIEW_MORE}
                  <ChevronDown />
                </button>
              </span>
            </Conditional>
          </Wrapper>
        );
      })}
    </>
  );
});
RichtextWithCTA.displayName = 'RichtextWithCTA';
export default RichtextWithCTA;
