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
  .collapsible-text {
    ${({ isExpanded }) => !isExpanded && `display: none;`}
  }
  .fadeout {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 120px;
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
    }
    svg {
      path {
        stroke: ${COLORS.TEXT.CANDY_1};
      }
      margin-bottom: -2px;
      ${({ isExpanded }) => isExpanded && ` transform: rotate(180deg);`}
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
        const { para_count: paraCount, cta_text, text: textArray } =
          block || {};
        return (
          <Wrapper key={index} isExpanded={isExpanded}>
            <RichText
              render={paraCount ? textArray.slice(0, paraCount) : textArray}
              htmlSerializer={shortCodeSerializer}
            />

            <Conditional if={cta_text}>
              <RichTextCTA {...block} />
            </Conditional>
            <Conditional if={paraCount}>
              <div className="collapsible-text">
                <RichText
                  render={textArray.slice(paraCount)}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
              <div className="fadeout" />
              <span className="toggle">
                <button onClick={handleClick} className="view-more">
                  {isExpanded ? strings.SHOW_LESS_TEXT : strings.VIEW_MORE}
                </button>
                {CHEVRON_DOWN}
              </span>
            </Conditional>
          </Wrapper>
        );
      })}
    </>
  );
};
export default RichtextWithCTA;
