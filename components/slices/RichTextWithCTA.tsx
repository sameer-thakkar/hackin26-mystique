import React, { useState } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import Conditional from 'components/common/Conditional';
import RichTextCTA from 'UI/RichTextCTA';
import { shortCodeSerializer } from 'utils/shortCodes';
import styled from 'styled-components';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';
import { CHEVRON_DOWN } from 'assets/SvgIcons';
import { strings } from 'const/strings';

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

const RichtextWithCTA = (props: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {props.slices.map((block: any, index: number) => {
        const { content_height: contentHeight, cta_text, text: textArray } =
          block || {};
        return (
          <Wrapper
            key={index}
            $isExpanded={isExpanded}
            $contentHeight={contentHeight}
            // @ts-expect-error TS(2769): No overload matches this call.
            $hasCTA={cta_text}
          >
            <div className="rich-text">
              <RichText
                render={textArray}
                htmlSerializer={shortCodeSerializer}
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
                  {CHEVRON_DOWN}
                </button>
              </span>
            </Conditional>
          </Wrapper>
        );
      })}
    </>
  );
};
export default RichtextWithCTA;
