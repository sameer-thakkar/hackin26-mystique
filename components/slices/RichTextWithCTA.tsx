import React, { useState } from 'react';
import { RichText } from 'prismic-reactjs';
import Conditional from 'components/common/Conditional';
import RichTextCTA from 'UI/RichTextCTA';
import { shortCodeSerializer } from 'utils/shortCodes';
import styled from 'styled-components';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';
import { CHEVRON_DOWN } from 'assets/SvgIcons';
import { strings } from 'const/strings';

const Wrapper = styled.div`
  position: relative;
  .rich-text {
    ${({ isExpanded, contentHeight }) =>
      !isExpanded && `height: ${contentHeight}px;`}
    ${({ contentHeight }) => contentHeight && `margin-bottom: -6px;`}
    ${({ isExpanded }) => !isExpanded && `overflow: hidden;`}
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
    ${({ isExpanded }) => isExpanded && `display: none;`}
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
      ${({ isExpanded }) => isExpanded && ` transform: rotate(180deg);`}
    }
  }
  @media (max-width: 768px) {
    .rich-text {
      ${({ isExpanded, contentHeight, hasCTA }) =>
        hasCTA && !isExpanded && `height: ${2 * contentHeight}px;`}
    margin-bottom: unset;
    }
  }
`;

const RichtextWithCTA = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {props.slices.map((block, index) => {
        const { content_height: contentHeight, cta_text, text: textArray } =
          block || {};
        return (
          <Wrapper
            key={index}
            isExpanded={isExpanded}
            contentHeight={contentHeight}
            hasCTA={cta_text}
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
